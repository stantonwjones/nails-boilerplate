import nails from "../../../../../index.js";
export default class ManualRenderAsyncController extends nails.Controller {
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
