module.exports = function(Raffle) {

  Raffle.observe('before save', function(ctx, next) {
    if ( ctx.instance ) {
      ctx.instance.date = new Date();
    } else {
      ctx.data.date = new Date();
    }
    next();
  });


  // listRaffles
  Raffle.listRaffles = function(cb) {
    Raffle.find({
      fields: {
        balance: false
      }
    }, cb);
  };
  Raffle.remoteMethod('listRaffles', {
    returns: {arg: 'Raffles', type: 'array'},
    http: {path:'/list-Raffles', verb: 'get'}
  });

  // donate
  Raffle.donate = function(id, amount, cb) {
    Raffle.findById(id, function(err, Raffle) {
      if (err) return cb(err);

      Raffle.balance += amount;
      Raffle.save();

      cb(null, true);
    });
  };
  Raffle.remoteMethod('donate', {
    accepts: [
      {arg: 'id', type: 'number'},
      {arg: 'amount', type: 'number'},
    ],
    returns: {arg: 'success', type: 'boolean'},
    http: {path:'/donate', verb: 'post'}
  });

  // withdraw
  Raffle.withdraw = function(id, amount, cb) {
    Raffle.findById(id, function(err, Raffle) {
      if (err) return cb(err);

      Raffle.balance = Raffle.balance >= amount ?
          Raffle.balance - amount : 0;
      Raffle.save();

      cb(null, true);
    });
  };
  Raffle.remoteMethod('withdraw', {
    accepts: [
      {arg: 'id', type: 'number'},
      {arg: 'amount', type: 'number'},
    ],
    returns: {arg: 'success', type: 'boolean'},
    http: {path:'/withdraw', verb: 'post'}
  });
};
