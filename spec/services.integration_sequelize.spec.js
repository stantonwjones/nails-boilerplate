import * as chai from 'chai';
import { default as chaiHttp, request } from "chai-http";
// import chaiHttp from 'chai-http';
import { assert } from 'chai';
// import { WebSocket } from 'ws';
import WebSocket from 'ws';
// const WebSocket = require('ws');

var express_app;

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Integration", function () {
  before(async function () {
    try {
      var nails = (await import('./services/integration_sequelize/server.js')).default;
    } catch (e) {
      console.log("could not import server");
      console.log(e);
    }
    console.log("got here");
    express_app = nails.application;
  });
  describe("GET /", function () {
    it('should return the expected JSON from index', function (done) {
      request.execute(express_app)
        .get('/')
        .end((err, res) => {
          if (err) console.error(err);
          res.should.have.status(200);
          assert(res.text == JSON.stringify({ home_index: true }));
          done();
        });
    });
  });
  describe("/listowners", function() {
    it('should return an empty array if no owners', function(done) {
      request.execute(express_app)
        .get('/listowners')
        .end((err, res) => {
          res.should.have.status(200);
          assert(JSON.parse(res.text).length == 0);
          done();
        });
    })
  })
  describe("/listowneddogs", function() {
    it('should return an empty array if no owned dogs', function(done) {
      request.execute(express_app)
        .get('/listowneddogs')
        .end((err, res) => {
          res.should.have.status(200);
          assert(JSON.parse(res.text).length == 0);
          done();
        });
    })
  })
});