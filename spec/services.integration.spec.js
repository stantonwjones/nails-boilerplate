// Import the dependencies for testing
var chai = require('chai');
var chaiHttp = require('chai-http');
var nails = require('./services/integration/server.js');
var express_app = nails.application;
const assert = require('assert');

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Integration", function() {
  describe("GET /", function() {
    it('should return the expected JSON from index', function(done) {
      chai.request(express_app)
          .get('/')
          .end((err, res) => {
            res.should.have.status(200);
            assert(res.text == JSON.stringify({home_index: true}));
            done();
          });
    });
  });
  describe("GET /classbased", function() {
    it('should return the expected JSON from index', function(done) {
      chai.request(express_app)
          .get('/classbased')
          .end((err, res) => {
            res.should.have.status(200);
            console.log("response: ", res.text);
            assert(res.text == JSON.stringify({classbased_index: true}));
            done();
          });
    });
  });
});
