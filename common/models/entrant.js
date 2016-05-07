module.exports = function(Entrant) {

  // Entrant.disableRemoteMethod("create", true);
  Entrant.disableRemoteMethod("upsert", true);
  Entrant.disableRemoteMethod("updateAll", true);
  //Entrant.disableRemoteMethod("updateAttributes", false);

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

  Entrant.displayTicketNumber = function(entrant){
    return entrant.id.split('').splice(0,6).join('');
  };

};
