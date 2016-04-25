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

    Raffle.create().then(function(result){
      console.log(result);

      res.render('new', {
        raffle: result
      });
    });
  });

  router.get(/raffles\/\d+\/run/, function(req, res) {
    var re = /raffles\/(\d+)\/run/;
    var id = req.url.match(re)[1];
    console.log("Raffle id: " + id);

    var Raffle = app.models.raffle;
    var Entrant = app.models.entrant;
    var raffle = null;
    var eligible_entrants = null;
    var winner = null;
    var previous_winners = null;
    var alert = null;


    var render_round = function() {
      console.log("Inside render_round");
      res.render('show', {
        raffle: raffle,
        alert: alert,
        entrants: eligible_entrants,
        winner: winner,
        previous_winners: previous_winners
      });
    };

    var get_eligible_entrants = function(result){
      console.log("Inside get_eligible_entrants");
      raffle = result;
      raffle.updateAttribute('active', true);

      Entrant.find({where: {and: [{raffleId: raffle.id}, {eligible: true}]}}).then(get_previous_winners);
    };

    var get_previous_winners = function(result){
      console.log("Inside get_previous_winners");
      eligible_entrants = (result && result.length > 0) ? result : null;
      Entrant.find({where: {and: [{raffleId: raffle.id}, {eligible: false}]}}).then(get_winner);
    };

    var get_winner = function(result){
      console.log("Inside get_winner");
      previous_winners = (result && result.length > 0) ? result : null;

      if (eligible_entrants && eligible_entrants.length > 0){
        var winner_index = Math.floor(Math.random() * eligible_entrants.length);
        winner = eligible_entrants[winner_index];
        console.log("Winner index: " + winner_index);
        console.log("Winner name: " + winner.username);
        winner.updateAttribute('eligible', false);
        alert = "" + winner.username + " has won this round!!!"
      } else {
        raffle.updateAttribute('active', false);
        alert = "Raffle is over."
      }

      render_round();
    };

    console.log("Before Raffle findById");
    Raffle.findById(id).then(get_eligible_entrants);
    console.log("After Raffle findById");
  });

  router.delete(/raffles\/\d+\/run/, function(req, res) {
    var re = /raffles\/(\d+)\/run/;
    var id = req.url.match(re)[1];

    raffle.updateAttribute('active', false);
    res.redirect('/raffles');
  });


  router.get(/\/raffles\/\d+/, function(req, res) {
    var re = /raffles\/(\d+)/;
    var id = req.url.match(re)[1];
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
