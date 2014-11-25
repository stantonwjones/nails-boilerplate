// The Router object which handles incoming urls and executes the correct
// server-side logic based on the matching route in the Routing Table
// ( See example/config/routes.js or config/routes.js for a description of the routes )

var EventEmitter = require('events').EventEmitter;
var URL = require('url');
var querystring = require('querystring');
var _ = require('underscore');
var express = require('express');
//form.uploadDir = process.env.TMP || process.env.TMPDIR || process.env.TEMP || '/tmp' || process.cwd();
module.exports = Router;

Router.prototype.__proto__ = EventEmitter.prototype;

// Creates a Router from an Array of route definitions
// may want to change this to singleton... just to continue paradigm
// emits: "contoller_name:action" on successful route
// controllers and the viewer listen to this object for instructions on doing shit
function Router( routes ) {
    EventEmitter.call(this);
    this.express_router = express.Router();
    this.addRoutes( routes );
}

Router.prototype.setUploadDir = function( up_dir ) {
    this.upload_dir = up_dir;
};
Router.prototype.addRoutes = function( routes ) {
    this.routes = routes;
    routes.forEach(this.addRoute.bind(this));
};

Router.prototype.addRoute = function( route ) {
    //this.routes.push( route );
    var method = route[0].toLowerCase();
    var pathMatcher = route[1];
    var consequences = route[2];
    var handler = this.get_express_route_handler(consequences);
    this.express_router[method](pathMatcher, handler);
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
        '\nSERVER_LOG:: Router recieved request for: ', request.method, request.url, '\n');

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

/*j
Router.prototype.handle_incoming_form = function(request, response) {
    var form = new IncomingForm();
    form.uploadDir = this.upload_dir;
    form.keepExtensions = true;
    form.on('error', console.log.bind(console, 'FORM ERROR:'));
    return form.parse(request, this.handle_parsed_form.bind(this, request, response) );
}

Router.prototype.handle_parsed_form = function( request, response, error, fields, files ) {
    console.log('the files are:',files);
    request.parsed_form = true;
    request.form_fields = fields;
    request.files = files;
    this.route(request, response);
}

Router.prototype.get_dispatch_params = function( method, path, query, form_fields, files) {
    var match = this.get_matched_route( method, path );
    var matched_route = match[0];
    var regex_captures = match[1];

    var disp_params = this.get_params_from_route( matched_route, regex_captures );
    _.extend(disp_params.params, query, form_fields, files);
    //params.params.files = files;
    
    if (disp_params.action == 'public') disp_params.params.path = disp_params.params.path || path;
    if (!disp_params.controller) disp_params.controller = matched_route[2].controller || 'home';
    if (!disp_params.action) disp_params.action = matched_route[2].action || 'index';

    return disp_params;
}

/*
Router.prototype.get_matched_route = function( method, path ) {
    for ( var i = 0; i < this.routes.length; i++ ) {

        // Check if the method matches first
        if ( method.toLowerCase() != this.routes[i][0].toLowerCase() ) continue;

        // match the path - queries against the regex item in the route array
        var match = path.match( this.routes[i][1] );

        // Continue to next item if the route doesn't match the url
        if ( !match ) continue;
        match.unshift();
        return [this.routes[i], match];
    }
    // no matched route. TODO: handle this
    return [null, null];
}

Router.prototype.get_params_from_route = function( matched_route, regex_captures ) {
    console.log('the regex captures are: ', regex_captures);
    // TODO: refractor this. Also rethink errors
    if(!matched_route) return {
        controller: 'applicationcontroller',
        action: '404',
        params: {error: new Error('No matching route')}
    };
    var static_route_params = this.get_static_file_params(matched_route);
    if (static_route_params) return static_route_params;
    return this.get_controller_action_params(matched_route, regex_captures);
}

Router.prototype.get_static_file_params = function( matched_route ) {
    if ( matched_route[2].public ) return {
        action: 'public',
        controller: 'applicationcontroller',
        params: {
            path: matched_route[2].path
        }
    }
}

Router.prototype.get_controller_action_params = function( matched_route, regex_captures ) {
    var route_params = {params: {}};
    for ( var j in matched_route[2] ) {
        if ( !regex_captures[j] ) continue;

        if( matched_route[2][j].match( /^file$/i ) ) {
            route_params.params.path = match[j];
        } else if ( matched_route[2][j].match( /^controller$/i ) ) {
            route_params.controller = regex_captures[j];
        } else if ( matched_route[2][j].match( /^action$/i ) ) {
            route_params.action = regex_captures[j];
        } else {
            route_params.params[ matched_route[2][j] ] = regex_captures[j];
        }
    }

    return route_params;
}
*/

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

