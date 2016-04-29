module.exports = function(Raffle) {

  // Raffle.disableRemoteMethod("create", true);
  Raffle.disableRemoteMethod("upsert", true);
  Raffle.disableRemoteMethod("updateAll", true);
  // Raffle.disableRemoteMethod("updateAttributes", false);

  // Raffle.disableRemoteMethod("find", true);
  // Raffle.disableRemoteMethod("findById", true);
  // Raffle.disableRemoteMethod("findOne", true);

  Raffle.disableRemoteMethod("deleteById", true);

  Raffle.disableRemoteMethod("confirm", true);
  Raffle.disableRemoteMethod("count", true);
  Raffle.disableRemoteMethod("exists", true);
  Raffle.disableRemoteMethod("resetPassword", true);

  Raffle.disableRemoteMethod('__count__accessTokens', false);
  Raffle.disableRemoteMethod('__create__accessTokens', false);
  Raffle.disableRemoteMethod('__delete__accessTokens', false);
  Raffle.disableRemoteMethod('__destroyById__accessTokens', false);
  Raffle.disableRemoteMethod('__findById__accessTokens', false);
  Raffle.disableRemoteMethod('__get__accessTokens', false);
  Raffle.disableRemoteMethod('__updateById__accessTokens', false);

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

    Raffle.run_raffle = function(id, res){
      console.log("Inside render raffle");
      var Raffle = app.models.raffle;
      var raffle = null;
      var eligible_entrants = [];
      var winner = null;
      var previous_winners = [];

      var render_round = function(raffle) {
        console.log("Inside render_round");
        res.render('run', {
          raffle: raffle,
          entrants: eligible_entrants,
          winner: winner,
          previous_winners: previous_winners
        });
      };

      console.log("Round id: " + id);
      Raffle.findById(id).then(function(raffle){
        console.log(raffle);

        console.log("Requesting raffle by id and getting entrants");
        entrants = raffle.entrants();

        eligible_entrants = entrants.filter(function(entrant){
          return entrant.eligible;
        });

        eligible_entrants = eligible_entrants.sort(function compare(a, b) {
          if (a.username > b.username) {
            return -1;
          }
          if (a.username < b.username) {
            return 1;
          }
          // a must be equal to b
          return 0;
        });

        console.log("Requesting previous_winners");
        previous_winners = entrants.filter(function(entrant){
          return !entrant.eligible;
        });

        console.log("Done. Moving on to render function...");
        render_round(raffle);
      }); // end Raffle.findById.then
    }; // end Raffle.render_raffle()


    Raffle.render_raffle = function(id, res){
      console.log("Inside render raffle");
      var Raffle = app.models.raffle;
      var raffle = null;
      var eligible_entrants = [];
      var winner = null;
      var previous_winners = [];

      var render_show = function(raffle) {
        console.log("Inside render_show");
        res.render('show', {
          raffle: raffle,
          entrants: eligible_entrants,
          previous_winners: previous_winners
        });
      };

      Raffle.findById(id).then(function(raffle){
        console.log(raffle);

        console.log("Requesting raffle by id and getting entrants");
        entrants = raffle.entrants();

        eligible_entrants = entrants.filter(function(entrant){
          return entrant.eligible;
        });

        eligible_entrants = eligible_entrants.sort(function compare(a, b) {
          if (a.username > b.username) {
            return -1;
          }
          if (a.username < b.username) {
            return 1;
          }
          // a must be equal to b
          return 0;
        });


        console.log("Requesting previous_winners");
        previous_winners = entrants.filter(function(entrant){
          return !entrant.eligible;
        });

        console.log("Done. Moving on to render function...");
        render_show(raffle);
      }); // end Raffle.findById.then
    }; // end Raffle.render_raffle()


    Raffle.end_raffle = function(id, res){
      console.log("Inside end raffle");
      var Raffle = app.models.raffle;
      var raffle = null;
      var eligible_entrants = [];
      var previous_winners = [];

      var render_show = function(raffle) {
        console.log("Inside render_show for end raffle");
        res.render('show', {
          raffle: raffle,
          entrants: eligible_entrants,
          previous_winners: previous_winners
        });
      };

      Raffle.findById(id).then(function(raffle){
        console.log(raffle);
        console.log("Requesting raffle by id and ending");
        entrants = raffle.entrants();

        console.log("Requesting previous_winners");
        previous_winners = entrants.filter(function(entrant){
          return !entrant.eligible;
        });

        eligible_entrants = entrants.filter(function(entrant){
          return entrant.eligible;
        });

        eligible_entrants = eligible_entrants.sort(function compare(a, b) {
          if (a.username > b.username) {
            return -1;
          }
          if (a.username < b.username) {
            return 1;
          }
          // a must be equal to b
          return 0;
        });

        raffle.updateAttributes({"active": false});

        console.log("Done. Moving on to render function...");
        render_show(raffle);
      }); // end Raffle.findById.then
    }; // end Raffle.render_raffle()


  }); // end Raffle.on('attach')

}; // end module.exports
