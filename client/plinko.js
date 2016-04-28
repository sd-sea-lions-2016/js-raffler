function pageScroll() {
  window.scrollBy(0,5); // horizontal and vertical scroll increments
  scrolldelay = setTimeout('pageScroll()',13); // scrolls every 150 milliseconds
}

$(function(){

  var numContestants = $('#numContestants').html();
  var isRaffleActive = $('#raffle-status').html();
  var raffle_path_with_id = $('#start-raffle-round').attr('action');
  var rc = new RaffleDBConnector(raffle_path_with_id);

  if (isRaffleActive){
    Plinko(rc);
  } else {
    console.log("Raffle is closed. Send to view page.");
  }

  function Plinko(databaseConnector){

    console.log("Inside plinko.");
    var row = 1;
    var previousRow = 0;
    var nextRow = 2
    var startingSquare = Math.floor(Math.random() * (numContestants*2));
    var square = startingSquare + 1;
    var previousSquare = square;
    var falling_ball_timeout = 100; // ms
    var num_rows = 133;
    var extra = 2;
    var wait_time_before_winner_announced = (falling_ball_timeout * (num_rows + extra)) + 1000; // ms
    var i = 0;
    pageScroll();
    random2 = Math.floor(Math.random() * (2));
    whereToMove = [0,1][random2];

    (function move (i) {
      setTimeout(function () {
        $('table tbody tr:nth-child('+row+') td:nth-child('+square+')').addClass('black');
        $('table tbody tr:nth-child('+previousRow+') td:nth-child('+previousSquare+')').removeClass('black');
        $('table tbody tr:nth-child('+previousRow+') td:nth-child('+previousSquare+')').css('background-color', 'yellow');

        var random = Math.floor(Math.random() * (40));
        var selection_array = [0,1];

        // console.log(whereToMove);
        if(whereToMove == 0){
          selection_array = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1];
        }
        else if(whereToMove == 1){
          selection_array = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0];
        };

        var random_index = Math.floor(Math.random() * selection_array.length)
        whereToMove = selection_array[random_index];

        // console.log(whereToMove);

        var LEFT = 0;
        var RIGHT = 1;
        var LEFT_MOST_SQUARE = 1;
        var RIGHT_MOST_SQUARE = (numContestants * 2)

        if (--i) {
          move(i);
          row++;
          previousRow++;
          nextRow++;
          previousSquare = square;
            if($('table :first-child :nth-child('+row+') :nth-child('+square+')').hasClass('blue')){
              if(whereToMove == RIGHT && square != RIGHT_MOST_SQUARE){
                square++;
              }
              else if(whereToMove == LEFT && square != LEFT_MOST_SQUARE){
              square--;
              }
              else if(whereToMove == LEFT && square == LEFT_MOST_SQUARE){
                square++;
                whereToMove = 1;
              }
              else if(whereToMove == RIGHT && square == RIGHT_MOST_SQUARE){
                square--;
                whereToMove = 0;
              }
            }
            else{
            square;
            }
        }
        if (nextRow > num_rows){
          console.log("Inside winner's circle");
          // Winner
          var winner = {};
          var cellIndex = $('.black').index() / 2;
          $('.black').closest('tr').next().children().eq(cellIndex).css('background-color', 'red');
          winner.id = $('.black').closest('tr').next().children().eq(cellIndex).attr('id');
          winner.username = $('.black').closest('tr').next().children().eq(cellIndex).html(); //NEEDS to look up winner by id
          var modal = document.getElementById('myModal');
          $('#message_winner').html(winner.username +' has won!');
          modal.style.display = "block";
          // Get the modal
          var modal = document.getElementById('myModal');
          // Get the <span> element that closes the modal
          var span = document.getElementsByClassName("close")[0];

          // When the user clicks on <span> (x), close the modal
          span.onclick = function() {
              modal.style.display = "none";
          }
          databaseConnector.setWinner(winner);
        }
      }, falling_ball_timeout);
    })(num_rows);

  } // end Plinko

}); // end jQuery


function RaffleDBConnector(path){
  this.raffle_path_with_id = path;
};

RaffleDBConnector.prototype.getEntrantUpdateURL = function(){
  var url = window.location.protocol + "//" + window.location.host + "/api" + this.raffle_path_with_id + "/entrants/" + this.winner.id;
  console.log("url: " + url);
  return url;
};

RaffleDBConnector.prototype.setWinner = function(winner){
  console.log("Inside RaffleDBConnector.setWinner");
  var data = {"eligible": false, "id": this.winner.id };
  this.winner = winner
  console.log("About to notify DB of winner " + winner.username + " with id: " + winner.id);

  $.ajax({
    method: 'PUT',
    url: this.getEntrantUpdateURL(winner),
    data: data
  }) 
    .done(function(response){
      console.log("Return from ajax PUT call after raffle win.");
      console.log(response);
  })
    .fail(function(err){
      alert("DB error: " + err);
    });
};