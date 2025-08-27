import nails from "../../../../../index.js";

export default class JsonController extends nails.Controller {
  testparams(params, request, response) {
    // should just render the params as JSON
  }

  testaction(params, request, response) {
    return {json_testaction: true};
  }

  async testpromise(params, request, response) {
    return {json_testpromise: true};
  }
}
