import { Controller } from "../../../../../index.ts";

export default class HomeController extends Controller {
  index(params, request, response) {
    console.log("HOME::INDEX");
    response.json({
      home_index: true
    });
  };
  testaction(params, request, response) {
    response.json({
      home_testaction: true
    });
  }
  test_ejs() {
  };
}
