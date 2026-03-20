import { Controller } from "../../../../../index.ts";
import Dog from "../models/dog.js";
import Owner from "../models/owner.js";

export default class DefaultJsonController extends Controller {
  json = true;
  routes = [
    ['get', 'arbi/trary/testautoaction'],
    ['get', 'arbi/trary/testautojson', { action: 'testautojson' }],
    ['get', 'arbi/trary/testjsonoverridden', { action: 'testnojson', json: false }],
    ['get', '/listowners'],
    ['get', '/listowneddogs'],
  ];

  testautoaction(params, request, response) {
    return { json_testautoaction: true };
  }

  testautojson(params, request, response) {
    return { json_testautojson: true };
  }

  testnojson(params, request, response) { }

  async listowners(params, request, response) {
    return await Owner.findAll();
  }

  async listowneddogs(params, request, response) {
    return await Dog.findAll();
  }
}
