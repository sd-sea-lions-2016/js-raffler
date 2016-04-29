var chai = require('chai');
var should = chai.should,
    expect = chai.expect,
    assert = chai.assert,
    supertest = require('supertest'),
    api = supertest('http://localhost:3000');
var app = require('../server/server');

function json(verb, url) {
    return supertest(app)[verb](url)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);
}

describe('routes', function(){

  before(function(done) {
    require('./start-server');
    var raffle = {"date": "2016-04-28","active": true,"id": "1"};
    api
      .post('/api/raffles')
      .send(raffle);
    // api
    //   .get('/api/raffles')
    //   .send()
    done();
  });

  after(function(done) {
    app.removeAllListeners('started');
    app.removeAllListeners('loaded');
    done();
  });

  xit('successfully GETS the index route', function(done){
    json('get', '/api/')
      .expect(200, done);
  });

  it('successfully GETS the raffles route', function(done){
    json('get', '/api/raffles')
      .expect(200, done);
  });

  it('successfully POSTs to the raffles route', function(done){
    json('post', '/api/raffles')
      .expect(200, done);
  });

  xit('successfully POSTs to the login route', function(done){
    json('post', '/api/login')
      .expect(200, done);
  });

   it('successfully GETS the raffles id route', function(done){
    json('get', '/api/raffles/1')
      .expect(200, done);
  });

  xit('successfully GETS the raffle id end raffle route', function(done){
    json('get', '/api/raffles/1/end')
      .expect(200, done);
  });

  xit('succesfully GETs the logout route', function(done){
    json('get', '/api/logout')
      .expect(302, done);
  });


  // END OF TESTS
});
