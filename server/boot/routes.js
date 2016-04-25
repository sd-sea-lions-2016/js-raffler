module.exports = function(app) {
  var router = app.loopback.Router();

  router.get('/', function(req, res) {
    res.render('index', {
      loginFailed: false
    });
  });

  router.get('/raffles', function(req, res) {
    var Raffle = app.models.raffle;

    Raffle.find().then(function(raffles){
      res.render('raffles', {
        raffles: raffles
      });
    });
  });

  router.post('/raffles', function(req, res) {
    var Raffle = app.models.raffle;

    Raffle.create().then(function(raffle){
      // raffle is now active
      raffle.updateAttribute('active', true);
      res.render('new', {
        raffle: raffle
      });
    });
  });

  router.get(/raffles\/\d+/, function(req, res) {
    var re = /raffles\/(\d+)/;
    var id = req.url.match(re)[1];
    var Raffle = app.models.raffle;
    Raffle.render_raffle(id, res);
  });

  router.delete(/raffles\/\d+/, function(req, res) {
    var re = /raffles\/(\d+)/;
    var id = req.url.match(re)[1];

    // Raffle is now closed/inactive
    raffle.updateAttribute('active', false);
    Raffle.render_raffle(id, res);
  });


  // router.get(/\/raffles\/\d+/, function(req, res) {
  //   var re = /raffles\/(\d+)/;
  //   var id = req.url.match(re)[1];
  //   var Raffle = app.models.raffle;
  //   var Entrant = app.models.entrant;

  //   Raffle.findById(id).then(function(result){
  //     console.log(result);
  //     var raffle = result;

  //     Entrant.find({where: {raffleId: result.id}}).then(function(result){
  //       var entrants = result;
  //       console.log(entrants)
  //       res.render('show', {
  //         raffle: raffle,
  //         entrants: entrants
  //       });
  //     });
  //   });
  // });

  router.post('/login', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var Raffle = app.models.raffle;

    app.models.User.login({
      email: email,
      password: password
    }, 'user', function(err, token) {
      if (err)
        return res.render('index', {
          email: email,
          password: password,
          loginFailed: true
        });

      token = token.toJSON();

      Raffle.find().then(function(result){
        console.log(result);

        res.render('raffles', {
          raffles: result,
          username: token.user.username,
          accessToken: token.id
        });
      });

    });
  });

  router.get('/logout', function(req, res) {
    var AccessToken = app.models.AccessToken;
    var token = new AccessToken({id: req.query['access_token']});
    token.destroy();

    res.redirect('/');
  });

  app.use(router);
};
