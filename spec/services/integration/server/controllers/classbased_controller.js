import nails from "../../../../../index.js";
    // require("../../../../../index.js").Controller;
export default class ClassbasedController extends nails.Controller {
  // DO NOT OVERRIDE CONSTRUCTOR
  index(params, request, response) {
    response.json({
      classbased_index: true
    });
  }

  testaction(params, request, response) {
    response.json({
      classbased_testaction: true
    });
  }

  async testpromise(params, request, response) {
    response.json({
      classbased_testpromise: true
    });
  }
}
