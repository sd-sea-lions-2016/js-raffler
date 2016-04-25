module.exports = function(Raffle) {

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

};
