// Import the dependencies for testing
var chai = require('chai');
var chaiHttp = require('chai-http');
var nails = require('./services/integration/server.js');
var express_app = nails.application;
const assert = require('assert');
const {MongoMemoryServer} = require('mongodb-memory-server');

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
  describe("Mongoose Model", function() {
    let mongod = null;
    beforeEach(async function() {
      mongod = new MongoMemoryServer({port: 55555, dbName: "development"});
      await mongod.getConnectionString();
    });
    afterEach(async function() {
      await mongod.stop();
    });
    it('should save to the correct database', async function() {
      let dogName = "Penny";
      let dogId = null;
      chai.request(express_app)
          .get(`/modeltest/createdog?name=${dogName}`)
          .end((err, res) => {
            res.should.have.status(200);
            dogId = res.text;
            chai.request(express_app)
                .get(`modeltest/getdogbyid?id=${dogId}`)
                .end((err, res) => {
                  asset.equals(
                    res.text, JSON.stringify({name: dogName, good: true}));
                  done();
                });
          });
    });

  });
});
