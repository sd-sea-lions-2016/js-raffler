module.exports = function(Entrant) {

  // Entrant.disableRemoteMethod("create", true);
  Entrant.disableRemoteMethod("upsert", true);
  Entrant.disableRemoteMethod("updateAll", true);
  Entrant.disableRemoteMethod("updateAttributes", false);

  // Entrant.disableRemoteMethod("find", true);
  // Entrant.disableRemoteMethod("findById", true);
  Entrant.disableRemoteMethod("findOne", true);

  Entrant.disableRemoteMethod("deleteById", true);

  Entrant.disableRemoteMethod("confirm", true);
  Entrant.disableRemoteMethod("count", true);
  Entrant.disableRemoteMethod("exists", true);
  // Entrant.disableRemoteMethod("resetPassword", true);

  Entrant.disableRemoteMethod('__count__accessTokens', false);
  Entrant.disableRemoteMethod('__create__accessTokens', false);
  Entrant.disableRemoteMethod('__delete__accessTokens', false);
  Entrant.disableRemoteMethod('__destroyById__accessTokens', false);
  Entrant.disableRemoteMethod('__findById__accessTokens', false);
  Entrant.disableRemoteMethod('__get__accessTokens', false);
  Entrant.disableRemoteMethod('__updateById__accessTokens', false);

  var App;
  var Raffle;

  Entrant.on('attached', function(app) {
    App = app;
    Raffle = app.models.raffle;
  });

  Entrant.afterInitialize = function() {
    console.log("Inside entrant's afterInit");
    var entrant = this;

    if (!entrant.raffleId) {
      Raffle.findOne({where: {'active': true}}).then(function(raffle){
        console.log("Inside findOne");
        console.log("This is the raffle");
        console.log(raffle);

        if (raffle) {
          console.log("raffle is not null");
          console.log("raffle id: " + raffle.id);
          entrant.raffleId = raffle.id
          console.log("We added raffle id.")
          console.log("entrant.username:");
          console.log(entrant.username);
          console.log("entrant.raffleId");
          console.log(entrant.raffleId);
          entrant.save();
        } else {
          console.log("raffle is null so nothing done to entrant");
        }
      }); // end findOne
    } // end if entrant raffleID
  };

};
