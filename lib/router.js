// The Router object which handles incoming urls and executes the correct
// server-side logic based on the matching route in the Routing Table
// ( See example/config/routes.js or config/routes.js for a description of the routes )

var EventEmitter = require('events').EventEmitter;
var URL = require('url');
var path = require('path');
var querystring = require('querystring');
var expressWs = require('express-ws');
var app = require('./application.js');
//var nails = require('./nails.js');
var _extend = require('util')._extend;

/**
 *  Creates a Router from an Array of route definitions
 *  may want to change this to singleton... just to continue paradigm
 *  emits: "contoller_name:action" on successful route
 *  controllers and the viewer listen to this object for instructions on doing shit
 *
 *  @param routes the array of route definitions from the application config.
 *  @param application the nails application singleton.
 */
class Router extends EventEmitter {
  static get webSocketsEnabled() {
    return this._webSocketsEnabled;
  }
  static set webSocketsEnabled(enabled) {
    this._webSocketsEnabled = enabled;
  }

  static set expressWs(ews) {
    this._expressWs = ews;
  }
  static get expressWs() {
    return this._expressWs;
  }

  enableWebSockets() {
    if (Router.webSocketsEnabled) return;
    Router.webSocketsEnabled = true;
    Router.expressWs = expressWs(this.application);
  }
  constructor(routes, application) {
    super();
    this.application = application || app;
    this.express_router = app.Router();
    this.addRoutes(routes);
  }

  addRoutes(routes) {
    this.routes = routes;
    routes.forEach(this.addRoute.bind(this));
  }

  addRoute(route) {
    var method = route[0].toLowerCase();
    var path_matcher = route[1];
    var consequences = route[2];
    var is_public = consequences && consequences.public;
    console.log("setting route for", method, path_matcher, consequences);
    if (method.match(/ws/i)) {
      this.enableWebSockets();
      this.express_router.ws(
        path_matcher,
        this.get_websocket_handler(consequences));
    } else if (consequences && consequences.public)
      this.express_router.use(path_matcher,
          this.application.static(this.application.get('public_root')));
    else this.express_router[method](path_matcher,
        this.get_express_route_handler(consequences));
  }

// TODO: override these for shortcutting crud methods
// Router.prototype.get;
// Router.prototype.put;
// Router.prototype.post;
// Router.prototype.delete;
// end crud methods

  // TODO: Combine this with the regular route method
  routeWs(ws, request) {
    console.log(
      '\nSERVER_LOG:: WebSocket Router received request for: ',
      request.method,
      request.url,
      '\n'
    );
    var params = _extend({}, request.params);
    _extend(params, request.querty);

    var controller = params._controller;
    var action = params._action;
    console.log('the action is:', controller, action, params);
    console.log('the params are:', params);
    console.log('ws router emitting:', 'dispatchTo:' + controller);
    this.emit('dispatchTo:' + controller, action, params, request, null, ws);

    if (!request.handled_by_controller) {
      params.error = {message: 'controller ' + controller + ' does not exist'};
      console.log('closing websocket');
      return ws.close(1003, "Action Not available: #" + action);
      //this.emit('dispatchTo:application', 404, params, request, null, ws);
    }
  }

  route(request, response) {
    // TODO: use express logging.
    console.log(
        '\nSERVER_LOG:: Router recieved request for: ',
        request.method, request.url, '\n');

    var params = _extend({}, request.params);
    _extend(params, request.query);

    var controller = params._controller;
    //var action = routeParams.action || routeParams.file || routeParams.path;
    //var params = routeParams.params || {};
    var action = params._action;
    console.log('the action is:', controller, action, params);
    console.log('the params are:', params);

    console.log('router emitting:', 'dispatchTo:' + controller);
    this.emit('dispatchTo:' + controller, action, params, request, response);
    // TODO: raise 404 error using express
    params.error = {message: 'controller ' + controller + ' does not exist'};
    if (!request.handled_by_controller)
      this.emit('dispatchTo:application', 404, params, request, response);
  }

  get_websocket_handler(route_options) {
    route_options = route_options || {};
    return (ws, request) => {
      console.log("handling a websocket request");
      var controller = route_options['controller'];
      var action = route_options['action'];
      for (var i = 0; route_options[i]; i++) {
        if (route_options[i] == 'action') action = action || request.params[i];
        else if (route_options[i] == 'controller')
          controller = controller || request.params[i];
        else request.params[route_options[i]] = request.params[i];
      }
      request.params._action = action || request.params.action || "index";
      request.params._controller =
          controller || request.params.controller || "application";

      this.routeWs(ws, request);
    };
  }

  get_express_route_handler(route_options) {
    route_options = route_options || {};
    return (request, response) => {
      // See if controller and action are set explicitly.
      var controller = route_options['controller'];
      var action = route_options['action'];
      // TODO: see if there is a way to use mimie types for this.
      var json = !!route_options['json'];
      var path = route_options['path']; // TODO: what to do with this under express.
      var async = route_options['async'];
      var autorender = route_options['disable_autorender'];

      // Check for controller and action from regex assignments.
      for (var i = 0; route_options[i]; i++) {
        if (route_options[i] == 'action') action = action || request.params[i];
        else if (route_options[i] == 'controller')
          controller = controller || request.params[i];
        else if (route_options[i] == 'json')
          json = json || request.params[i];
        else request.params[route_options[i]] = request.params[i];
      }

      // Check for controller and action in parameters.
      request.params._action = action || request.params.action || "index";
      request.params._controller =
          controller || request.params.controller || "application";
      request.params._json = json || !!request.params.json;
      request.params._async = async == null || async == undefined ?
          !!this.application.get('nails_config').config.ASYNC : async;
      // autorender should default to true if it is not defined
      request.params._autorender = autorender ? !!autorender : true;

      this.route(request, response);
    };
  }
}

module.exports = Router;
