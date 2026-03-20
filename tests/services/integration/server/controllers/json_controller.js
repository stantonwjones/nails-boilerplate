import {Controller} from "../../../../../index.ts";

export default class JsonController extends Controller {
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
