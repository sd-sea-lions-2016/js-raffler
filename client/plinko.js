$(function() {
  new Plinko();
});

function Plinko(){
  this.loadRaffle();
  this.run();
};

Plinko.prototype.loadRaffle = function(){
  this.numContestants = 10;
};

Plinko.prototype.move = function(){
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
    }, falling_ball_timeout);
  }
};

Plinko.prototype.run = function(){
  console.log(this.numContestants);
  var numContestants = this.numContestants;
  console.log("Inside plinko");
  console.log("numContestants: " + numContestants + "!");
  var row = 1;
  var previousRow = 0;
  var nextRow = 2
  var startingSquare = Math.floor(Math.random() * (numContestants*2));
  var square = startingSquare + 1;
  var previousSquare = square;
  var falling_ball_timeout = 110; // ms
  var num_rows = 25;
  var extra = 4;
  var wait_time_before_winner_announced = falling_ball_timeout * (num_rows + extra); // ms
  var i = 0;
  console.log(square);
  this.move(num_rows);

  setTimeout(function(){
    var cellIndex = $('.black').index() / 2;
    $('.black').closest('tr').next().children().eq(cellIndex).css('background-color', 'red');
    var winner = $('.black').closest('tr').next().children().eq(cellIndex).html();
    alert(winner+' has won!');
  }, wait_time_before_winner_announced);

};




