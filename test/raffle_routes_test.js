var chai = require('chai');
var should = chai.should,
    expect = chai.expect,
    assert = chai.assert,
    supertest = require('supertest'),
    api = supertest('http://localhost:3000');

describe('routes', function(){

  it('successfully GETS the index route', function(done) {
    api.get('/')
    .expect(200)
    .end(function(err, res) {
      if (err) return done(err);
      done();
    });
  });

  it('successfullyGETS the raffles route', function(done) {
    api.get('/raffles')
    .expect(200)
    .end(function(err, res) {
      if (err) return done(err);
      done();
    });
  });

  it('successfully POSTs to the raffles route', function(done) {
    api.post('/raffles')
    .expect(200)
    .end(function(err, res) {
      if (err) return done(err);
      done();
    });
  });

  it('successfully POSTs to the login route', function(done) {
    api.post('/login')
    .expect(200)
    .end(function(err, res) {
      if (err) return done(err);
      done();
    });
  });

  it('succesfully GETs the raffle id route', function(done) {
    api.get('/raffles/1')
    .expect(200)
    .end(function(err, res) {
      if (err) return done(err);
      done();
    });
  });

  it('succesfully GETs the raffle id end raffle route', function(done) {
    api.get('/raffles/1/end')
    .expect(200)
    .end(function(err, res) {
      if (err) return done(err);
      done();
    });
  });

// get /logout redirects to index
  it('succesfully GETs the logout route', function(done) {
    api.get('/logout')
    .expect(302)
    .end(function(err, res) {
      if (err) return done(err);
      // res.header.location.should.include('/');
      done();
    });
  });

























  // END OF TESTS
});
