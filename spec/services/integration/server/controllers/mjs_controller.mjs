/*
const Controller =
    require("../../../../../index.js").Controller;
    */
import nails from "../../../../../index.js";
export default class MjsController extends nails.Controller {
  // DO NOT OVERRIDE CONSTRUCTOR
  index(params, request, response) {
    response.json({
      classbased_index: true
    });
  }
}
