import { chai, describe, it, expect, beforeAll } from 'vitest';
import {default as chaiHttp, request} from 'chai-http';
import WebSocket from 'ws';

let nails;
var express_app;

chai.use(chaiHttp);

const makeRequest = (path) => {
  return new Promise(resolve => {
    request.execute(express_app)
      .get(path)
      .end((err, res) => resolve(res));
  });
}

describe("Integration: Sequelize", () => {
  beforeAll(async () => {
    try {
      nails = (await import('./services/integration/server.js')).default;
    } catch (e) {
      console.log("could not import server");
      console.log(e);
    }
    express_app = nails.application;
  });

  describe("/listowners", () => {
    it('should return an empty array if no owners', async () => {
      const res = await makeRequest('/listowners');
      expect(res).to.have.status(200);
      expect(JSON.parse(res.text)).to.have.lengthOf(0);
    });
  });

  describe("/listowneddogs", () => {
    it('should return an empty array if no owned dogs', async () => {
      const res = await makeRequest('/listowneddogs');
      expect(res).to.have.status(200);
      expect(JSON.parse(res.text)).to.have.lengthOf(0);
    });
  });

  describe("GET /", () => {
    it('should return the expected JSON from index', async () => {
      const res = await makeRequest('/');
      expect(res).to.have.status(200);
      expect(res.text).to.equal(JSON.stringify({ home_index: true }));
    });
  });

  describe("GET /classbased", () => {
    it('should return the expected JSON from index', async () => {
      const res = await makeRequest('/classbased');
      expect(res).to.have.status(200);
      expect(res.text).to.equal(JSON.stringify({ classbased_index: true }));
    });
  });

  describe("Get /classbased/arbi/trary/testLocalRoutes", () => {
    it("Should respect the defined local route and return the expected JSON", async () => {
      const res = await makeRequest('/classbased/arbi00/trary00/testLocalRoutes');
      expect(res).to.have.status(200);
      expect(res.text).to.equal(JSON.stringify({ testLocalRoutes: true }));
    });

    it("Should not rewrite local route prefix and return the expected JSON", async () => {
      const res = await makeRequest('/cl4ssb4sed/arbi/trary/testLocalRoutes');
      expect(res).to.have.status(200);
      expect(res.text).to.equal(JSON.stringify({ testLocalRoutes: true }));
    });

    it("Should rewrite local route prefix, './' and return the expected JSON", async () => {
      const res = await makeRequest('/classbased/arbi/trary/testLocalRoutes');
      expect(res).to.have.status(200);
      expect(res.text).to.equal(JSON.stringify({ testLocalRoutes: true }));
    });
  });

  describe("Get /defaultjson/arbi/trary", () => {
    it("Should default to json if not present in route options", async () => {
      const res = await makeRequest('/defaultjson/arbi/trary/testautojson');
      expect(res).to.have.status(200);
      expect(res.text).to.equal(JSON.stringify({ json_testautojson: true }));
    });

    it("Should autoassign the action if not present in route options", async () => {
      const res = await makeRequest('/defaultjson/arbi/trary/testautoaction');
      expect(res).to.have.status(200);
      expect(res.text).to.equal(JSON.stringify({ json_testautoaction: true }));
    });

    it("Should not render json if route options explicitly say not to", async () => {
      const res = await makeRequest('/defaultjson/arbi/trary/testjsonoverridden');
      expect(res).to.have.status(200);
      expect(res.text).to.equal('I am some arbitrary text');
    });
  });

  describe("GET /^\\/(\\w+)\\/(\\w+)$/i", () => {
    it('should route to home_controller#testaction', async () => {
      const res = await makeRequest('/home/testaction');
      expect(res).to.have.status(200);
      expect(res.text).to.equal(JSON.stringify({ home_testaction: true }));
    });

    it('should route to classbased_controller#testaction', async () => {
      const res = await makeRequest('/classbased/testaction');
      expect(res).to.have.status(200);
      expect(res.text).to.equal(JSON.stringify({ classbased_testaction: true }));
    });

    it('should render correctly when a promise is returned', async () => {
      const res = await makeRequest('/classbased/testpromise');
      expect(res).to.have.status(200);
      expect(res.text).to.equal(JSON.stringify({ classbased_testpromise: true }));
    });
  });

  describe("GET /error/fivehundred", () => {
    it('should log the stack trace', async () => {
      const res = await makeRequest('/error/fivehundred/500');
      expect(res).to.have.status(500);
    });

    it('should return meaningful JSON', async () => {
      const res = await makeRequest('/error/fivehundred');
      expect(res).to.have.status(500);
    });
  });

  describe("WebSockets", () => {
    it("should listen on /", () => new Promise(resolve => {
      const wsClient = new WebSocket("ws://localhost:3333/");
      wsClient.on('message', (message) => {
        expect(message.toString()).to.equal("It worked");
        wsClient.close();
      });
      wsClient.on('close', () => resolve());
    }));

    it("should listen on /voodoo", () => new Promise(resolve => {
        const wsClient = new WebSocket("ws://localhost:3333/voodoo");
        wsClient.on('message', (message) => {
            expect(message.toString()).to.equal("Voodoo worked");
            wsClient.close();
        });
        wsClient.on('close', () => resolve());
    }));

    it("should not listen on /voodootwo", () => new Promise(resolve => {
        const wsClient = new WebSocket("ws://localhost:3333/voodootwo");
        wsClient.on('close', (code, reason) => {
            resolve();
        });
    }));

    it.todo("should be closed with the correct code if the action is absent");
    it.todo("should be closed with the correct code if the controller is absent");
    it.todo("should correctly parse the params");
    it.todo("should correctly handle dynamic controller and action");
  });

  describe("GET /json/:action", () => {
    it.todo('should render params if nothing is returned by the action');

    it('should render the returned object as json', async () => {
      const res = await makeRequest('/json/testaction');
      expect(res).to.have.status(200);
      expect(res.text).to.equal(JSON.stringify({ json_testaction: true }));
    });

    it('should asynchronously render the resolved promise as json', async () => {
      const res = await makeRequest('/json/testpromise');
      expect(res).to.have.status(200);
      expect(res.text).to.equal(JSON.stringify({ json_testpromise: true }));
    });
  });

  describe("Get /ManualRenderAsync", () => {
    it("./testmanualrenderasync Should not throw an exception after manually rendering json asynchronously", async () => {
      const res = await makeRequest("/manualrenderasync/testmanualrenderasync");
      expect(res).to.have.status(200);
      expect(res.text).to.equal(JSON.stringify({ json_testmanualrenderasync: true }));
    });

    it("./testmanualrenderexplicitasync Should not throw an exception after manually rendering json asynchronously using the async function tag", async () => {
      const res = await makeRequest("/manualrenderasync/testmanualrenderexplicitasync");
      expect(res).to.have.status(200);
      expect(res.text).to.equal(JSON.stringify({ json_testmanualrenderexplicitasync: true }));
    });
  });

  describe("Mongoose Model", () => {
    it('should save to the correct database', async () => {
      const dogName = "Penny";
      const createRes = await makeRequest(`/modeltest/createdog?name=${dogName}`);
      expect(createRes).to.have.status(200);
      const dogId = createRes.text.replaceAll("\"", "");
      const getRes = await makeRequest(`/modeltest/getdogbyid?id=${dogId}`);
      const dogOnServer = JSON.parse(getRes.text);
      expect(dogOnServer.name).to.equal(dogName);
      expect(dogOnServer.good).to.be.true;
      expect(dogOnServer).to.have.property('id');
      expect(dogOnServer).to.have.property('createdAt');
      expect(dogOnServer).to.have.property('updatedAt');
    });
  });
});
