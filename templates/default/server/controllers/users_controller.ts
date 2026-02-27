import {Controller} from "@projectinvicta/nails";
import User from "../models/User";

export default class UsersController extends Controller {
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
    ["get", "./list"],
  ];

  async list(params, request, response) {
    return await User.findAll();
  }

};