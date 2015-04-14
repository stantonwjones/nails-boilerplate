// The Router object which handles incoming urls and executes the correct
// server-side logic based on the matching route in the Routing Table
// ( See example/config/routes.js or config/routes.js for a description of the routes )

var EventEmitter = require('events').EventEmitter;
var URL = require('url');
var path = require('path');
var querystring = require('querystring');
var app = require('./application.js');
module.exports = Router;

Router.prototype.__proto__ = EventEmitter.prototype;

/**
 *  Creates a Router from an Array of route definitions
 *  may want to change this to singleton... just to continue paradigm
 *  emits: "contoller_name:action" on successful route
 *  controllers and the viewer listen to this object for instructions on doing shit
 *
 *  @param routes the array of route definitions from the application config.
 *  @param application the nails application singleton.
 */
function Router( routes, application ) {
    EventEmitter.call(this);
    this.application = application || app;
    this.express_router = app.Router();
    this.addRoutes( routes );
}

Router.prototype.addRoutes = function( routes ) {
    this.routes = routes;
    routes.forEach(this.addRoute.bind(this));
};

Router.prototype.addRoute = function( route ) {
    var method = route[0].toLowerCase();
    var path_matcher = route[1];
    var consequences = route[2];
    var is_public = consequences && consequences.public;
    console.log("setting route for", method, path_matcher, consequences);
    if (consequences && consequences.public)
        this.express_router.use(path_matcher,
            this.application.static(this.application.get('public_root')));
    else this.express_router[method](path_matcher,
            this.get_express_route_handler(consequences));
};

// TODO: override these for shortcutting crud methods
Router.prototype.get;
Router.prototype.put;
Router.prototype.post;
Router.prototype.delete;
// end crud methods

Router.prototype.route = function( request, response ) {
    // TODO: use express logging.
    console.log(
        '\nSERVER_LOG:: Router recieved request for: ',
        request.method, request.url, '\n');

    var params = request.params;

    var controller = params.controller;
    //var action = routeParams.action || routeParams.file || routeParams.path;
    //var params = routeParams.params || {};
    var action = params.action;
    console.log('the action is:', controller, action, params);
    console.log('the params are:', params);

    console.log('router emitting:', 'dispatchTo:'+controller);
    this.emit( 'dispatchTo:'+controller, action, params, request, response );
    // TODO: raise 404 error using express
    params.error = {message: 'controller ' + controller + ' does not exist'};
    if (!request.handled_by_controller)
        this.emit( 'dispatchTo:application', 404, params, request, response );
}

Router.prototype.get_express_route_handler = function(route_options) {
    route_options = route_options || {};
    return function(request, response) {
        // See if controller and action are set explicitly.
        var controller = route_options['controller'];
        var action = route_options['action'];
        var path = route_options['path']; // TODO: what to do with this under express.

        // Check for controller and action from regex assignments.
        for (var i = 0; route_options[i]; i++) {
            if (route_options[i] == 'action') action = action || request.params[i];
            else if (route_options[i] == 'controller')
                controller = controller || request.params[i];
            else request.params[route_options[i]] = request.params[i];
        }

        // Check for controller and action in parameters.
        request.params.action = action || request.params.action || "index";
        request.params.controller =
            controller || request.params.controller || "application";

        this.route(request, response);
    }.bind(this);
}

