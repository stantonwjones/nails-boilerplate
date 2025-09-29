// Import the dependencies for testing
import * as chai from 'chai';
import { default as chaiHttp, request } from "chai-http";
// import chaiHttp from 'chai-http';
import { assert } from 'chai';
// import { WebSocket } from 'ws';
import WebSocket from 'ws';
// const WebSocket = require('ws');

var express_app;
// const {MongoMemoryServer} = require('mongodb-memory-server');
let mongod = null;

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Integration", function () {
  before(async function () {
    // this.timeout(30000);
    try {
      var nails = (await import('./services/integration/server.js')).default;
    } catch (e) {
      console.log("could not import server");
      console.log(e);
    }
    console.log("got here");
    express_app = nails.application;
    return new Promise((resolve, reject) => {
      nails.events.on("ready", () => {
        console.log("ready was emitted!");
        resolve();
      });
    });
    // })
    // MongoMemoryServer.create({instance: service_config.db}).then((mongodb) => {
    //   mongod = mongodb;

    // });
  });
  describe("GET /", function () {
    it('should return the expected JSON from index', function (done) {
      request.execute(express_app)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          assert(res.text == JSON.stringify({ home_index: true }));
          done();
        });
    });
  });
  describe("GET /classbased", function () {
    it('should return the expected JSON from index', function (done) {
      request.execute(express_app)
        .get('/classbased')
        .end((err, res) => {
          res.should.have.status(200);
          assert(res.text == JSON.stringify({ classbased_index: true }));
          done();
        });
    });
  });
  describe("Get /classbased/arbi/trary/testLocalRoutes", function () {
    it("Should respect the defined local route and return the expected JSON", function (done) {
      request.execute(express_app)
        .get('/classbased/arbi00/trary00/testLocalRoutes')
        .end((err, res) => {
          res.should.have.status(200);
          assert(res.text == JSON.stringify({ testLocalRoutes: true }));
          done();
        });
    });
    it("Should not rewrite local route prefix and return the expected JSON", function (done) {
      request.execute(express_app)
        .get('/cl4ssb4sed/arbi/trary/testLocalRoutes')
        .end((err, res) => {
          res.should.have.status(200);
          assert(res.text == JSON.stringify({ testLocalRoutes: true }));
          done();
        });
    });
    it("Should rewrite local route prefix, './' and return the expected JSON", function (done) {
      request.execute(express_app)
        .get('/classbased/arbi/trary/testLocalRoutes')
        .end((err, res) => {
          res.should.have.status(200);
          assert(res.text == JSON.stringify({ testLocalRoutes: true }));
          done();
        });
    });
  });
  describe("Get /defaultjson/arbi/trary", function () {
    it("Should default to json if not present in route options", function(done) {
      request.execute(express_app)
        .get('/defaultjson/arbi/trary/testautojson')
        .end((err, res) => {
          res.should.have.status(200);
          assert(res.text == JSON.stringify({ json_testautojson: true }));
          done();
        });
    });
    it("Should autoassign the action if not present in route options", function(done) {
      request.execute(express_app)
        .get('/defaultjson/arbi/trary/testautoaction')
        .end((err, res) => {
          res.should.have.status(200);
          assert(res.text == JSON.stringify({ json_testautoaction: true }));
          done();
        });
    });
    it("Should not render json if route options explicitly say not to", function(done) {
      request.execute(express_app)
        .get('/defaultjson/arbi/trary/testjsonoverridden')
        .end((err, res) => {
          res.should.have.status(200);
          assert(res.text == 'I am some arbitrary text');
          done();
        });
    })
  });
  describe("GET /^\\/(\\w+)\\/(\\w+)$/i", function () {
    it('should route to home_controller#testaction', function (done) {
      request.execute(express_app)
        .get('/home/testaction')
        .end((err, res) => {
          res.should.have.status(200);
          assert(res.text == JSON.stringify({ home_testaction: true }));
          done();
        });
    });
    it('should route to classbased_controller#testaction', function (done) {
      request.execute(express_app)
        .get('/classbased/testaction')
        .end((err, res) => {
          res.should.have.status(200);
          assert(res.text == JSON.stringify({ classbased_testaction: true }));
          done();
        });
    });
    it('should render correctly when a promise is returned', function (done) {
      request.execute(express_app)
        .get('/classbased/testpromise')
        .end((err, res) => {
          res.should.have.status(200);
          assert(res.text == JSON.stringify({ classbased_testpromise: true }));
          done();
        });
    })
  });

  describe("GET /error/fivehundred", function () {
    it('should log the stack trace', function (done) {
      request.execute(express_app)
        .get('/error/fivehundred/500')
        .end((err, res) => {
          res.should.have.status(500);
          //console.log(res.text);
          //console.log(res);
          //console.log(err);
          done();
        })
    });
    it('should return meaningful JSON', function (done) {
      request.execute(express_app)
        .get('/error/fivehundred')
        .end((err, res) => {
          res.should.have.status(500);
          console.log("ZZZZZZZZZZ");
          console.log(res.text);
          //console.log(res.text);
          //console.log(res);
          //console.log(err);
          done();
        })
    });
  });

  describe("WebSockets", function () {
    it("should listen on /", function (done) {
      this.timeout(2000);
      var requester = request.execute(express_app).keepOpen();
      var wsClient = new WebSocket("ws://localhost:3333/");

      wsClient.on('close', () => done());
      wsClient.on('message', (message) => {
        assert(message == "It worked");
      });
    });
    it("should listen on /voodoo", function (done) {
      this.timeout(2000);
      var requester = request.execute(express_app).keepOpen();
      var wsClient = new WebSocket("ws://localhost:3333/voodoo");

      wsClient.on('message', (message) => {
        assert(message == "Voodoo worked");
      });
      wsClient.on('close', (code, reason) => done());
    });
    it("should not listen on /voodootwo", function (done) {
      // TODO: this doesn't fail. Figure out why.
      //done();
      this.timeout(2000);
      var requester = request.execute(express_app).keepOpen();
      var wsClient = new WebSocket("ws://localhost:3333/voodootwo");

      wsClient.on('close', (code, reason) => {
        console.log('voodootwo closed', code, reason);
        done();
      });
      debugger;
    });
    it("should be closed with the correct code if the action is absent");
    it("should be closed with the correct code if the controller is absent");
    it("should correctly parse the params");
    it("should correctly handle dynamic controller and action");
  });

  describe("GET /json/:action", function () {
    it('should render params if nothing is returned by the action',
      function (done) {
        request.execute(express_app)
          // Route to index action.
          .get('/json/testparams?testkey=testvalue')
          .end((err, res) => {
            res.should.have.status(200);
            assert(JSON.parse(res.text).testkey == "testvalue");
            done();
          });
      }
    );
    it('should render the returned object as json', function (done) {
      request.execute(express_app)
        .get('/json/testaction')
        .end((err, res) => {
          res.should.have.status(200);
          assert(res.text == JSON.stringify({ json_testaction: true }));
          done();
        });
    });
    it('should asynchronously render the resolved promise as json',
      function (done) {
        request.execute(express_app)
          .get('/json/testpromise')
          .end((err, res) => {
            res.should.have.status(200);
            assert(res.text == JSON.stringify({ json_testpromise: true }));
            done();
          });
      }
    );
  });
  describe("Get /ManualRenderAsync", function () {
    it("./testmanualrenderasync Should not throw an exception after manually"
      + " rendering json asynchronously",
      done => {
        request.execute(express_app)
          .get("/manualrenderasync/testmanualrenderasync")
          .end((err, res) => {
            res.should.have.status(200);
            assert(res.text ==
              JSON.stringify({ json_testmanualrenderasync: true }));
            done();
          });
      });

    it("./testmanualrenderexplicitasync Should not throw an exception after"
      + " manually rendering json asynchronously using the async function"
      + " tag",
      done => {
        request.execute(express_app)
          .get("/manualrenderasync/testmanualrenderexplicitasync")
          .end((err, res) => {
            res.should.have.status(200);
            assert(res.text ==
              JSON.stringify({ json_testmanualrenderexplicitasync: true }));
            done();
          });
      });

  });
  describe("Mongoose Model", function () {
    beforeEach(async function () {
      // Used to initialize mongod here
    });
    afterEach(async function () {
      //await mongod.stop();
    });
    it('should save to the correct database', function (done) {
      let dogName = "Penny";
      let dogId = null;
      request.execute(express_app)
        .get(`/modeltest/createdog?name=${dogName}`)
        .end((err, res) => {
          res.should.have.status(200);
          dogId = res.text.replaceAll('"', '');
          request.execute(express_app)
            .get(`/modeltest/getdogbyid?id=${dogId}`)
            .end((err, res) => {
              assert.equal(
                res.text, JSON.stringify({ name: dogName, good: true }));
              done();
            });
        });
    });

  });
});
