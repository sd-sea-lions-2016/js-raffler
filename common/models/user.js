module.exports = function(User) {

  User.disableRemoteMethod("create", true);
  User.disableRemoteMethod("upsert", true);
  User.disableRemoteMethod("updateAll", true);
  User.disableRemoteMethod("updateAttributes", false);

  User.disableRemoteMethod("find", true);
  User.disableRemoteMethod("findById", true);
  User.disableRemoteMethod("findOne", true);

  User.disableRemoteMethod("deleteById", true);

  User.disableRemoteMethod("confirm", true);
  User.disableRemoteMethod("count", true);
  User.disableRemoteMethod("exists", true);
  User.disableRemoteMethod("resetPassword", true);

  User.disableRemoteMethod('__count__accessTokens', false);
  User.disableRemoteMethod('__create__accessTokens', false);
  User.disableRemoteMethod('__delete__accessTokens', false);
  User.disableRemoteMethod('__destroyById__accessTokens', false);
  User.disableRemoteMethod('__findById__accessTokens', false);
  User.disableRemoteMethod('__get__accessTokens', false);
  User.disableRemoteMethod('__updateById__accessTokens', false);

};
