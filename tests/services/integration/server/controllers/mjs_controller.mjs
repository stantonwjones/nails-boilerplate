import {Controller} from "../../../../../index.js";
export default class MjsController extends Controller {
  // DO NOT OVERRIDE CONSTRUCTOR
  index(params, request, response) {
    response.json({
      classbased_index: true
    });
  }
}
