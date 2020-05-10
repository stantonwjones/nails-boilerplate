var assert = require('assert');
var sinon = require('sinon');
var chai = require('chai');
var chaiHttp = require('chai-http');
var nails = require('../server.js');
var express_app = nails.application;

chai.use(chaiHttp);
chai.should();

describe("GET /", () => {
  it('Should render the home page', done => {

  });
});
