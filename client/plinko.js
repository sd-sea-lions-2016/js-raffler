function pageScroll() {
  window.scrollBy(0,3); // horizontal and vertical scroll increments
  var function_name = 'pageScroll()';
  scrolldelay = setTimeout(function_name,25); // scrolls every n milliseconds
}

function toggleZoomScreen() {
document.body.style.zoom="50%";
}

$( document ).ready(function() {

  toggleZoomScreen();
  var numEntrants = $('#numContestants').html();
  var isRaffleActive = $('#raffle-status').html();
  var raffle_id = $('#raffle-id').html();
  var rc = new RaffleDBConnector(raffle_id);

  if (isRaffleActive){
    $('#start-raffle-round').hide();
    $('#end-raffle').hide();
    $('#exit-raffle').hide();

    Plinko(numEntrants, rc);

  } else {
    $('#end-raffle').show();
    $('#exit-raffle').show();
    console.log("Raffle is closed. Send to view page.");
  }



  function Plinko(numContestants, databaseConnector){
    console.log("Inside plinko.");
    var row = 1;
    var previousRow = 0;
    var nextRow = 2;
    var startingSquare = Math.floor(Math.random() * (numContestants*2));
    var square = startingSquare + 1;
    var previousSquare = square;
    var falling_ball_timeout = 85; // ms
    var num_rows = 89;
    var extra = 2;
    var wait_time_before_winner_announced = (falling_ball_timeout * (num_rows + extra)) + 1500; // ms
    var i = 0;
    pageScroll();
    random2 = Math.floor(Math.random() * (2));
    whereToMove = [0,1][random2];
    var sound = new Audio("/audio/bgsound.mp3");
    sound.play();

    (function move (i) { // associated with num_rows
      setTimeout(function () {  // associated with falling_ball_timeout
        $('table tbody tr:nth-child('+row+') td:nth-child('+square+')').addClass('black');
        $('table tbody tr:nth-child('+previousRow+') td:nth-child('+previousSquare+')').removeClass('black');
        $('table tbody tr:nth-child('+previousRow+') td:nth-child('+previousSquare+')').css('background-color', 'yellow');

        var random = Math.floor(Math.random() * (40));
        var selection_array = [0,1];

        // console.log(whereToMove);
        if(whereToMove === 0){
          selection_array = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1];
        }
        else if(whereToMove == 1){
          selection_array = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,0];
        }

        var random_index = Math.floor(Math.random() * selection_array.length);
        whereToMove = selection_array[random_index];

        // console.log(whereToMove);

        var LEFT = 0;
        var RIGHT = 1;
        var LEFT_MOST_SQUARE = 1;
        var RIGHT_MOST_SQUARE = (numContestants * 2);

        if (--i) { // ball movement
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
        } // end ball movement
        if (nextRow > num_rows){ // if on last row
          console.log("Inside winner's circle");
          var cellIndex = $('.black').index() / 2;
          console.log("Winning cell index: " + cellIndex);
          cellIndex = Math.round(cellIndex);
          console.log("After rounding: " + cellIndex);
          var winner = {};
          winner = {};
          winner.username = $('.black').closest('tr').next().children().eq(cellIndex).attr('username');
          winner.id = $('.black').closest('tr').next().children().eq(cellIndex).attr('id');
          console.log(winner);

          if (winner.username){
            // we're done moving. set winning cell to color red
            $('.black').closest('tr').next().children().eq(cellIndex).css('background-color', 'red');

            // Get the modal
            var modal = document.getElementById('myModal');
            $('#message_winner').html('<p>' + winner.username + ' has won!</p><p>Ticket#' + winner.id.split('').splice(0,6).join('') + '</p>');
            modal.style.display = "block";

            // Get the <span> element that closes the modal
            span = document.getElementsByClassName("close")[0];

            // When the user clicks on <span> (x), close the modal
            span.onclick = function() {
                modal.style.display = "none";
            };
            databaseConnector.setWinner(winner);
            if (numContestants > 1){
              $('#start-raffle-round').show();
            }
            $('#end-raffle').show();
            $('#exit-raffle').show();
          }
        } // end 'if on last row'
      }, falling_ball_timeout);
    })(num_rows);

  } // end Plinko

}); // end jQuery

function RaffleDBConnector(raffle_id){
  this.raffle_id = raffle_id;
}

RaffleDBConnector.prototype.getEntrantUpdateURL = function(){
  var url = window.location.protocol + "//" + window.location.host + "/api/raffles/" + this.raffle_id + "/entrants/" + this.winner.id;
  //var url = "/api/" + this.raffle_id + "/entrants/" + this.winner.id;
  console.log("url: " + url);
  return url;
};

RaffleDBConnector.prototype.setWinner = function(winner){
  console.log("Inside RaffleDBConnector.setWinner");
  this.winner = winner;
  var data = {"eligible": false, "id": this.winner.id, "username": this.winner.username };
  console.log("About to notify DB of winner " + this.winner.username + " with id: " + this.winner.id);

  $.ajax({
    method: 'PUT',
    url: this.getEntrantUpdateURL(),
    data: data
  })
    .done(function(response){
      console.log("Return from ajax PUT call after raffle win.");
      console.log(response);
  })
    .fail(function(err){
      console.log(err);
      alert("DB error: " + err.statusText + ": " + err.responseText);
    });
};
