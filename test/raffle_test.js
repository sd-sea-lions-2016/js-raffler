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

describe('raffles', function(){

  it('should return an array of raffles', function(done) {
    json('get', '/api/raffles')
      .expect(200, function(err, res){
        assert(Array.isArray(res.body));
        assert.typeOf(res.body[1], 'object', 'response contains a raffle');
        // assert.equal(res.body.length, 7);
        done();
      });
  });

  xit('should return an array of entrants', function(done) {
    json('get', '/api/raffles/11')
      .expect(200, function(err, res){
        // assert(Array.isArray(res.body));
        assert.typeOf(res.body, 'object', 'response contains an entrant');
        console.log(res.body);
      done();
      });
  });

  xit('should return a list of entrants', function(done) {
    json('get', '/api/raffles/1')
      .expect(200, function(err,res){
        assert.equal(res.entrants.linkedType, 'Entrant');
        assert(Array.isArray(res.body));
        // assert.typeOf(res.body[1], 'object', 'response contains an entrant');
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

























