var chai = require('chai');
var should = chai.should,
    expect = chai.expect,
    assert = chai.assert,
    supertest = require('supertest'),
    api = supertest('http://localhost:3000');
var app = require('../server/server');
var Entrant = app.models.entrant;
var Raffle = app.models.raffle;

function json(verb, url) {
    return supertest(app)[verb](url)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);
}

describe('raffles', function(){

  before(function(done) {
    require('./start-server');
    var raffle = {"date": "2016-04-28","active": true};
    api
      .post('/api/raffles')
      .send(raffle);
    done();
  });

  after(function(done) {
    app.removeAllListeners('started');
    app.removeAllListeners('loaded');
    done();
  });



  it('should return an array of raffles', function(done) {
    json('get', '/api/raffles')
      .expect(200, function(err, res){
        assert(Array.isArray(res.body));
        assert.typeOf(res.body[1], 'object', 'response contains a raffle');
        done();
      });
  });

  it('should return an array of entrants', function(done) {
    Raffle.findById(1).then(function(raffle){
        raffle.entrants.create({'username': "Joe"});
    });
    console.log(Raffle.findById(1));
    json('get', '/api/raffles/1')
      .expect(200, function(err, res){
        assert(Array.isArray(res.body._entrants));
        assert.typeOf(res.body._entrants[0], 'object', 'response contains an entrant');
        console.log(res.body._entrants);
      done();
      });
  });

});


describe('Unexpected Usage', function(){
  it('should not crash the server when posting a bad id', function(done){
    json('post', '/api/raffles/foobar')
      .send({})
      .expect(404, done);
  });
});









