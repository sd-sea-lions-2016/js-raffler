module.exports = function(app) {
  var router = app.loopback.Router();

  router.get('/', function(req, res) {
    res.render('index', {
      loginFailed: false
    });
  });

  router.get('/raffles', function(req, res) {
    console.log("happy smiley");
    var Raffle = app.models.raffle;

    Raffle.find().then(function(result){
      console.log(result);

      res.render('raffles', {
        raffles: result
      });
    });
  });

  router.post('/raffles', function(req, res) {
    console.log("happy smiley");
    var Raffle = app.models.raffle;

    Raffle.create().then(function(result){
      console.log(result);

      res.render('new', {
        raffle: result
      });
    });
  });

  router.get(/raffles\/\d+\/run/, function(req, res) {
    console.log("happy smiley with winners");
    var re = /raffles\/(\d+)\/run/;
    var id = req.url.match(re)[1];
    console.log("Raffle id: " + id);

    var Raffle = app.models.raffle;
    var Entrant = app.models.entrant;
    var raffle;
    var eligible_entrants;
    var winner;
    var previous_winners;

    var render_round = function() {
      console.log("Inside render entrants");
      res.render('show', {
        raffle: raffle,
        alert: "Round is over",
        entrants: eligible_entrants,
        winner: winner,
        previous_winners: previous_winners
      });
    };

    var get_eligible_entrants = function(result){
      raffle = result;
      Entrant.find({where: {and: [{raffleId: raffle.id}, {eligible: true}]}}).then(get_previous_winners);
    };

    var get_previous_winners = function(result){
      eligible_entrants = result;
      Entrant.find({where: {and: [{raffleId: raffle.id}, {eligible: false}]}}).then(get_winner);
    };

    var get_winner = function(result){
      previous_winners = result;

      if (eligible_entrants.length > 0){
        var winner_index = Math.floor(Math.random() * eligible_entrants.length);
        winner = eligible_entrants[winner_index];
        console.log("Winner index: " + winner_index);
        console.log("Winner name: " + winner.username);
        winner.updateAttribute('eligible', false);
      } else {
        eligible_entrants = "No one left!"
        winner = "Sorry, no more prizes. :(";
      }

      render_round();
    };

    Raffle.findById(id).then(get_eligible_entrants);
  });

  router.get(/\/raffles\/\d+/, function(req, res) {
    console.log("happy smiley with numbers");
    var re = /raffles\/(\d+)/;
    var id = req.url.match(re)[1];
    console.log(id);
    var Raffle = app.models.raffle;
    var Entrant = app.models.entrant;

    Raffle.findById(id).then(function(result){
      console.log(result);
      var raffle = result;

      Entrant.find({where: {raffleId: result.id}}).then(function(result){
        var entrants = result;
        console.log(entrants)
        res.render('show', {
          raffle: raffle,
          entrants: entrants
        });
      });
    });
  });

  router.post('/login', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    console.log("happy smiley");
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
