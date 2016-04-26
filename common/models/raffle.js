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

  Raffle.on('attached', function(app) {

    Raffle.render_raffle = function(id, res){
      console.log("Inside render raffle");
      var Raffle = app.models.raffle;
      var raffle = null;
      var eligible_entrants = [];
      var winner = null;
      var previous_winners = [];
      var alert = null;

      var render_round = function(raffle) {

        res.render('show', {
          raffle: raffle,
          alert: alert,
          entrants: eligible_entrants,
          winner: winner,
          previous_winners: previous_winners
        });
      };

      console.log("Round id: " + id);
      Raffle.findById(id).then(function(raffle){
        entrants = raffle.entrants();

        eligible_entrants = entrants.filter(function(entrant){
          return entrant.eligible;
        });

        previous_winners = entrants.filter(function(entrant){
          return !entrant.eligible;
        });

        if (raffle.active && eligible_entrants && eligible_entrants.length > 0){
          var winner_index = Math.floor(Math.random() * eligible_entrants.length);
          winner = eligible_entrants[winner_index];
          // update entrant to be ineligible (already won once) from further rounds in this raffle.
          raffle.entrants.updateById(winner.id, function(err, entrant){
            entrant.updateAttribute('eligible', false);
            entrant.save();
          });
          alert = "" + winner.username + " has won this round!!!";
        } else {
          raffle.updateAttribute('active', false);
          alert = "Raffle is closed.";
        }
        render_round(raffle);
      }); // end Raffle.findById.then
    }; // end Raffle.render_raffle()

  }); // end Raffle.on('attach')

}; // end module.exports
