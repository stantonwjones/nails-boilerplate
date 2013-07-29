// The Router object which handles incoming urls and executes the correct
// server-side logic based on the matching route in the Routing Table
// ( See example/config/routes.js or config/routes.js for a description of the routes )

var EventEmitter = require('events').EventEmitter;
var URL = require('url');
var _ = require('underscore');
var form = new (require('formidable').IncomingForm)();
module.exports = Router;

Router.prototype.__proto__ = EventEmitter.prototype;

// Creates a Router from an Array of route definitions
// may want to change this to singleton... just to continue paradigm
// emits: "contoller_name:action" on successful route
// controllers and the viewer listen to this object for instructions on doing shit
function Router( routes ) {
    EventEmitter.call(this);
    this.setRoutes( routes );
}

Router.prototype.setRoutes = function( routes ) {
    this.routes = routes;
};

Router.prototype.addRoute = function( route ) {
    this.routes.push( route );
};

// TODO: override these for shortcutting crud methods
Router.prototype.get;
Router.prototype.put;
Router.prototype.post;
Router.prototype.delete;
// end crud methods

Router.prototype.route = function( request, response ) {

    if ( !request.parsed_form && request.method.match('/^(post|put)$/i') )
        return form.parse(request, this.handle_parsed_form.bind(this) );
    
    var method = request.method;
    var uri = URL.parse( request.url );
    console.log('\nREQUEST BODY: '+JSON.stringify(request.body)+'\n');

    console.log( '\nSERVER_LOG:: Router recieved request for: ', method, request.url, '\n'); // refractor logs

    var routeParams = this.get_dispatch_params( method, uri.pathname, uri.query );

    var controller = routeParams.controller;
    var action = routeParams.action || routeParams.file;
    var params = routeParams.params || {};
    console.log('the action is:', controller, action, params);
    console.log(routeParams);

    this.emit( 'dispatchTo:'+controller, action, params, request, response );
    if (!request.handled_by_controller) console.log('should raise 404');
    if (!request.handled_by_controller)
        this.emit( 'dispatchTo:applicationcontroller', action, params, request, response );

}

Router.prototype.handle_parsed_form = function( error, fields, files ) {
    console.log(error);
    console.log(fields);
    console.log(files);
}

Router.prototype.get_dispatch_params = function( method, path, query) {
    var match = this.get_matched_route( method, path );
    var matched_route = match[0];
    var regex_captures = match[1];

    var params = this.get_params_from_route( matched_route, regex_captures );
    _.extend(params.params, query);
    
    if (params.action == 'public') params.params.path = params.params.path || path;
    if (!params.controller) params.controller = matched_route[2].controller || 'home';
    if (!params.action) params.action = matched_route[2].action || 'index';

    return params;
}

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
        params: {}
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

