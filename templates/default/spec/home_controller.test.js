import nails from 'nails-boilerplate';
// import chai from 'chai';
import {default as chaiHttp, request} from 'chai-http';
import service_config from '../config/service.js';
import { chai, beforeAll, test, expect } from "vitest";

let express_app;

beforeAll(async () => {
  // Initialize the application and start the server
  (await nails( service_config )).startServer();
  express_app = nails.application;
  chai.use(chaiHttp);
  chai.should();
})


test("GET / renders the home page", async () => {
  return await new Promise((resolve, reject) => {
    request.execute(express_app)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.text).toContain("Welcome to Nails");
        resolve();
      });
  });
});
