module.exports = function(Raffle) {

  Raffle.observe('before save', function(ctx, next) {
    if ( ctx.instance ) {
      ctx.instance.date = new Date();
    } else {
      ctx.data.date = new Date();
    }
    next();
  });

};
