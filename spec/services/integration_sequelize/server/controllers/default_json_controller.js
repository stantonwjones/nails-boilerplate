import nails from "../../../../../index.js";
import Dog from "../models/dog.js";
import Owner from "../models/owner.js";

export default class DefaultJsonController extends nails.Controller {
  json = true;
  routes = [
    ['get', '/listowners'],
    ['get', '/listowneddogs'],
  ];

  async listowners(params, request, response) {
    return await Owner.findAll();
  }

  async listowneddogs(params, request, response) {
    // await nails._dbConnector.afterInitialization();
    // await Dog.sync({alter: true});
    return await Dog.findAll();
  }
}
