import {Controller} from "../../../../../index.ts";
export default class ManualRenderAsyncController extends Controller {
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
