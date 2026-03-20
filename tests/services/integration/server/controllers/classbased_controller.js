import nails, {Controller} from "../../../../../index.ts";
    // require("../../../../../index.js").Controller;
export default class ClassbasedController extends Controller {
  routes = [
    ["get", "./arbi/trary/testLocalRoutes", {action: 'testLocalRoutes', json: true}],
    ["get", "arbi00/trary00/testLocalRoutes", {action: 'testLocalRoutes', json: true}],
    ["get", "/cl4ssb4sed/arbi/trary/testLocalRoutes", {action: 'testLocalRoutes', json: true}],
  ];
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

  testLocalRoutes(params, request, response) {
    return {
      testLocalRoutes: true
    };
  }
}
