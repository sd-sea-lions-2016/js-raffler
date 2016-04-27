module.exports = function(app) {
  var router = app.loopback.Router();

  router.get('/', function(req, res) {
    res.render('index', {
      loginFailed: false
    });
  });

  router.get('/raffles', function(req, res) {
    console.log("Inside router.get /raffles");
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

  router.post(/^\/raffles\/\d+\/end/, function(req, res) {
    console.log("Inside router.post /raffles/:id/end");
    var re = /raffles\/(\d+)\/end/;
    var id = req.url.match(re)[1];
    var Raffle = app.models.raffle;

    Raffle.findById(id).then(function(raffle){
      // Raffle is now closed/inactive
      raffle.updateAttribute('active', false);
      Raffle.render_raffle(id, res);
    });
  });

  router.get(/^\/raffles\/\d+\/?$/, function(req, res) {
    console.log("inside router.get /raffles/:id");
    var re = /raffles\/(\d+)/;
    var id = req.url.match(re)[1];
    var Raffle = app.models.raffle;
    Raffle.render_raffle(id, res);
  });

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

  router.get('/register', function(req, res) {
    var Raffle = app.models.raffle;
    Raffle.findOne({where: {"active": true}}).then(function(raffle){
        res.render('form', {
          raffle: raffle
        });
    }).catch(function(err) { console.log("No active raffles"); });
  });

  router.post('/register', function(req, res) {
    var Raffle = app.models.raffle;

    Raffle.findOne({where: {"active": true}}).then(function(raffle){
      if (raffle){
        console.log("Active raffle found");
        if ( req.body.Body ) {
          console.log("We have a text message.");
          console.log(req.body.Body);
          raffle.entrants.create({"username": req.body.Body}, function(err,entrant){

            // some code to sent a text to req.body.from via the twilio api

          });
        } else {
          console.log("We got a web registration of either admin or public");
          console.log(req.body);
          raffle.entrants.create({"username": req.body.username}, function(err,entrant){
            console.log(err);
            console.log(entrant);
            res.send(entrant);
          });
        }
      } else {
        console.log("No raffle open.");
      } // end if raffle

    }); // end Raffle.findOne
  });

  router.get('/logout', function(req, res) {
    var AccessToken = app.models.AccessToken;
    var token = new AccessToken({id: req.query.access_token});
    token.destroy();

    res.redirect('/');
  });

  app.use(router);
};
