import nails from "../../../../../index.js";

export default class DefaultJsonController extends nails.Controller {
  json = true;
  routes = [
    ['get', 'arbi/trary/testautoaction'],
    ['get', 'arbi/trary/testautojson', {action: 'testautojson'}],
    ['get', 'arbi/trary/testjsonoverridden', {action: 'testnojson', json: false}],
  ];

  testautoaction(params, request, response) {
    return {json_testautoaction: true};
  }

  testautojson(params, request, response) {
    return {json_testautojson: true};
  }

  testnojson(params, request, response) {}
}
