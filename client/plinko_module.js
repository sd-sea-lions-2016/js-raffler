var PLINKO = PLINKO || (function(){

  var _args = {}; // private

  return {
    init: function(Args){
      _args = Args;
    },

    run: function() {
      numContestants = _args[0];
      $( document ).ready(function() {
      var row = 1;
      var previousRow = 0;
      var nextRow = 2
      var startingSquare = Math.floor(Math.random() * (numContestants*2));
      var square = startingSquare + 1;
      var previousSquare = square;

      var i = 0;
      (function move (i) {
        setTimeout(function () {
          $('table :first-child :nth-child('+row+') :nth-child('+square+')').addClass('black');
          $('table :first-child :nth-child('+previousRow+') :nth-child('+previousSquare+')').removeClass('black');
          var whereToMove = Math.floor(Math.random() * (2));

          if (--i) {
            move(i);
            row++;
            previousRow++;
            nextRow++;
            previousSquare = square;
              if($('table :first-child :nth-child('+row+') :nth-child('+square+')').hasClass('blue')){
                if(whereToMove == 0 && square != numContestants*2){
                  square++;
                }
                else if(whereToMove == 1 && square != 1){
                square--;
                }
                else if(whereToMove == 1 && square == 1){
                  square++;
                }
                else if(whereToMove == 0 && square == numContestants*2){
                  square--;
                }
              }
              else{
              square;
              }
          }
        }, 110);
      })(25);

      setTimeout(function(){
        var cellIndex = $('.black').index() / 2;
        $('.black').closest('tr').next().children().eq(cellIndex + 1).css('background-color', 'red');
        var winner = $('.black').closest('tr').next().children().eq(cellIndex + 1).html();
        alert(winner+' has won!');
      }, 3200);
      });

    } // end run
  }; // end return

}()); // end PLINKO
