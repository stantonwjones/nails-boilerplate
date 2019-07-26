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
            assert(res.text == JSON.stringify({classbased_index: true}));
            done();
          });
    });
  });
  describe("GET /^\\/(\\w+)\\/(\\w+)$/i", function() {
    it ('should route to home_controller#testaction', function(done) {
      chai.request(express_app)
          .get('/home/testaction')
          .end((err, res) => {
            res.should.have.status(200);
            assert(res.text == JSON.stringify({home_testaction: true}));
            done();
          });
    });
    it('should route to classbased_controller#testaction', function(done) {
      chai.request(express_app)
          .get('/classbased/testaction')
          .end((err, res) => {
            res.should.have.status(200);
            assert(res.text == JSON.stringify({classbased_testaction: true}));
            done();
          });
    });
    it('should render correctly when a promise is returned', function(done) {
      chai.request(express_app)
          .get('/classbased/testpromise')
          .end((err, res) => {
            res.should.have.status(200);
            assert(res.text == JSON.stringify({classbased_testpromise: true}));
            done();
          });
    })
  });
  describe("GET /json/:action", function() {
    it('should render params if nothing is returned by the action',
      function(done) {chai.request(express_app)
          // Route to index action.
          .get('/json/testparams?testkey=testvalue')
          .end((err, res) => {
            res.should.have.status(200);
            assert(JSON.parse(res.text).testkey == "testvalue");
            done();
          });
      }
    );
    it('should render the returned object as json', function(done) {
      chai.request(express_app)
          .get('/json/testaction')
          .end((err, res) => {
            res.should.have.status(200);
            assert(res.text == JSON.stringify({json_testaction: true}));
            done();
          });
    });
    it('should asynchronously render the resolved promise as json',
      function(done) {
        chai.request(express_app)
            .get('/json/testpromise')
            .end((err, res) => {
              res.should.have.status(200);
              assert(res.text == JSON.stringify({json_testpromise: true}));
              done();
            });
      }
    );

  });
});
