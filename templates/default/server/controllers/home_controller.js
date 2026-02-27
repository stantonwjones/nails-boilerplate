import {Controller} from "@projectinvicta/nails";

export default class HomeController extends Controller {
  /**
   * You can define a local routing table directly in the controller.
   * Local routes take precidence over global routes. All local routes
   * are prefixed with the controller name unless they start with '/'.
   * For example, in HomeController the following route:
   * 
   *   ["get", "data", {action: 'getData', json: true}],
   * 
   * will accept GET requests to /home/data and respond with the json
   * object returned by the getData function. If the route is changed to:
   * 
   *   ["get", "/data", {action: 'getData', json: true}],
   * 
   * it will accept GET requests to /data instead. All local routes are
   * implicitly routed to their respective parent controllers.
   */
  routes = [
    ["get", "data", {action: 'getData', json: true}],
  ];

  index(params, request, response) {
    return {
      title: "My first Nails Service",
      welcome_message: "Welcome to Nails"
    };
  }

  getData(params, request, response) {
    return {testData: Math.floor(Math.random() * 10000000)}
  }
};
