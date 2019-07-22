const Controller =
    require("../../../../../index.js").Controller;
class ClassbasedController extends Controller {
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
}

module.exports = ClassbasedController;
