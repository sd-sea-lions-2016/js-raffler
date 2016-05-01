module.exports = function(app) {
  var router = app.loopback.Router();

  router.get('/', function(req, res) {
    console.log("Inside router.get /");

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
    console.log("Inside router.post /raffles");

    var Raffle = app.models.raffle;

    Raffle.create().then(function(raffle){
      // raffle is now active
      raffle.updateAttribute('active', true);
      res.render('admin_registration', {
        raffle: raffle
      });
    });
  });

  router.post('/raffles/:id/end', function(req, res) {
    console.log("Inside router.post /raffles/:id/end");

    var id = req.params.id;
    var Raffle = app.models.raffle;
    Raffle.end_raffle(id, res);
  });

  router.get('/raffles/:id/run', function(req, res) {
    console.log("inside router.get /raffles/:id/run");

    var id = req.params.id;
    var Raffle = app.models.raffle;
    Raffle.run_raffle(id, res);
  });

  router.get('/raffles/:id', function(req, res) {
    console.log("inside router.get /raffles/:id");

    var id = req.params.id;
    var Raffle = app.models.raffle;
    Raffle.render_raffle(id, res);
  });

  router.post('/login', function(req, res) {
    console.log("inside router.post /login");

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
    console.log("inside router.get /register");

    var Raffle = app.models.raffle;
    Raffle.findOne({where: {"active": true}}).then(function(raffle){
        res.render('public_registration', {
          raffle: raffle
        });
    }).catch(function(err) { console.log("No active raffles"); });
  });

  router.post('/register', function(req, res) {
    console.log("inside router.post /register");

    var Raffle = app.models.raffle;

    Raffle.findOne({where: {"active": true}}).then(function(raffle){
      if (raffle){
        console.log("Active raffle found");
        if ( req.body.Body ) {
          console.log("We have a text message.");

          var username = req.body.Body;
          var phoneNumber = req.body.From;
          var myNumber = req.body.To;

          raffle.entrants.create({"username": username}, function(err,entrant){
            var body = 'You are registered in the SDJS raffle. Your ticket # is: ' + entrant.id.split('').splice(0,6).join('');

            // Twilio Credentials
            var accountSid = process.env.ACCOUNT_SID;
            var authToken = process.env.AUTH_TOKEN;

            var client = require('twilio')(accountSid, authToken);
            client.messages.create({
            	to: phoneNumber,
            	from: "+18588425841",
            	body: body,
            }, function(err, message) {
              console.log(err);
            	console.log(message.sid);
            });

          });
        } else {
          console.log("We got a web registration of either admin or public");
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
    console.log("inside router.get /logout");

    var AccessToken = app.models.AccessToken;
    var token = new AccessToken({id: req.query.access_token});
    token.destroy();

    res.redirect('/');
  });

  app.use(router);
};
