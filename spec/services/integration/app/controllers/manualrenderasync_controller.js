const Controller =
    require("../../../../../index.js").Controller;
class ManualRenderAsyncController extends Controller {
  testmanualrenderasync(params, request, response) {
    return new Promise((resolve, reject) => {
      response.json({json_testmanualrenderasync: true});
    });
  }

  async testmanualrenderexplicitasync(params, request, response) {
    return new Promise((resolve, reject) => {
      response.json({json_testmanualrenderexplicitasync: true});
    });
  }
}

module.exports = ManualRenderAsyncController;
