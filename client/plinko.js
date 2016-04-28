$(function() {  
  console.log("Inside plinko");

  // RaffleConnector returns an array of contestants
  var bob = "bob was here";
  var rc = new RaffleConnector(function(contestants){
    p = new Plinko();
    p.run(contestants, function(winner){
      console.log("Inside plinko cb");
      console.log("Winner is " + winner.username);
      console.log(winner.id);
      // update DB
      console.log(bob);
      rc.setWinner(winner);
    });
  });

});

function RaffleConnector(cb){
  console.log("Inside RaffleConnector");
  this.contestants = null;
  this.numContestants = null;
  this.raffle_path_with_id = null;
  this.init(cb);
}; // end RaffleConnector()


RaffleConnector.prototype.init = function(cb){
  console.log("Getting contestants from database");

  this.raffle_path_with_id = $('#start-raffle-round').attr('action');
  console.log("url: " + this.raffle_path_with_id);

  request_url = window.location.protocol + "//" + window.location.host + "/api" + this.raffle_path_with_id + "/entrants";
  console.log("new url: " + request_url);

  $.ajax({
    method: 'GET',
    url: request_url
  }) 
    .done(function(response){
      console.log("Return from ajax GET call");
      console.log(response);
      console.log("Single entrant: " + response[0]);
      this.contestants = response;
      cb(response);
  })
    .fail(function(err){
      alert("DB error: " + err);
    });
}; // end init()

RaffleConnector.prototype.setWinner = function(winner){
  var data = {"eligible": false, "id": winner.id }
  var url = window.location.protocol + "//" + window.location.host + "/api" + this.raffle_path_with_id + "/entrants/" + winner.id;
  $.ajax({
    method: 'PUT',
    url: request_url,
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


function Plinko(){};
Plinko.prototype.run = function(contestants, cb) {
  var numContestants = contestants.length;
  var row = 1;
  var previousRow = 0;
  var nextRow = 2
  var startingSquare = Math.floor(Math.random() * (numContestants*2));
  var square = startingSquare + 1;
  var previousSquare = square;
  var falling_ball_timeout = 110; // ms
  var num_rows = 25;
  var extra = 15;
  var wait_time_before_winner_announced = falling_ball_timeout * (num_rows + extra); // ms
  var i = 0;
  console.log(square);
  (function move (i) {
    setTimeout(function () {
      $('table :first-child :nth-child('+row+') :nth-child('+square+')').addClass('black');
      $('table :first-child :nth-child('+previousRow+') :nth-child('+previousSquare+')').removeClass('black');
      var whereToMove = Math.floor(Math.random() * (2));
      var LEFT = 1;
      var RIGHT = 0;
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
            }
            else if(whereToMove == RIGHT && square == RIGHT_MOST_SQUARE){
              square--;
            }
          }
          else{
          square;
          }
      }
      if (nextRow > num_rows){
        setTimeout(checkForWinner(cb), wait_time_before_winner_announced);
      }
    }, falling_ball_timeout);
  })(num_rows);

  function checkForWinner(cb){
    var cellIndex = $('.black').index() / 2;
    $('.black').closest('tr').next().children().eq(cellIndex).css('background-color', 'red');
    var winner = {};
    winner_td_tag = $('.black').closest('tr').next().children()
    winner.username = winner_td_tag.eq(cellIndex).html();
    winner.id = winner_td_tag.attr('id');
    cb(winner);
  };

};