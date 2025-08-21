import nails from 'nails-boilerplate';
import asser from 'assert';
import sinon from 'sinon';
import chai from 'chai';
import chaiHttp from 'chai-http';
import service_config from '../config/service.js';

nails( service_config );

var express_app = nails.application;

chai.use(chaiHttp);
chai.should();

describe("GET /", () => {
  it('Should render the home page', done => {

  });
});
