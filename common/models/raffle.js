module.exports = function(Raffle) {

  var app;

  Raffle.observe('before save', function(ctx, next) {
    if ( ctx.instance ) {
      // update on creation
      ctx.instance.date = new Date();
    } else {
      // uncomment to allow update on access
      // ctx.data.date = new Date();
    }
    next();
  });

  Raffle.prototype.printID = function(){
    console.log("Raffle id: " + this.id);
  };


  Raffle.on('attached', function(app) {

    Raffle.render_raffle = function(id, res){
      var Raffle = app.models.raffle;
      var Entrant = app.models.entrant;
      var raffle = null;
      var eligible_entrants = null;
      var winner = null;
      var previous_winners = null;
      var alert = null;

      var render_round = function() {
        console.log("Inside render_round");
        raffle.printID();
        res.render('show', {
          raffle: raffle,
          alert: alert,
          entrants: eligible_entrants,
          winner: winner,
          previous_winners: previous_winners
        });
      };

      var get_eligible_entrants = function(result){
        console.log("Inside get_eligible_entrants");
        raffle = result;

        Entrant.find({where: {and: [{raffleId: raffle.id}, {eligible: true}]}}).then(get_previous_winners);
      };

      var get_previous_winners = function(result){
        console.log("Inside get_previous_winners");
        eligible_entrants = (result && result.length > 0) ? result : null;
        Entrant.find({where: {and: [{raffleId: raffle.id}, {eligible: false}]}}).then(get_winner);
      };

      var get_winner = function(result){
        console.log("Inside get_winner");
        previous_winners = (result && result.length > 0) ? result : null;

        if (raffle.active && eligible_entrants && eligible_entrants.length > 0){
          var winner_index = Math.floor(Math.random() * eligible_entrants.length);
          winner = eligible_entrants[winner_index];
          console.log("Winner index: " + winner_index);
          console.log("Winner name: " + winner.username);
          winner.updateAttribute('eligible', false);
          alert = "" + winner.username + " has won this round!!!";
        } else {
          raffle.updateAttribute('active', false);
          alert = "Raffle is over.";
        }

        render_round();
      };

      Raffle.findById(id).then(get_eligible_entrants);
    };
  });

};


