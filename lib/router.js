// The Router object which handles incoming urls and executes the correct
// server-side logic based on the matching route in the Routing Table
// ( See example/config/routes.js or config/routes.js for a description of the routes )

var EventEmitter = require('events').EventEmitter;
var URL = require('url');
var _ = require('underscore');
module.exports = Router;

Router.prototype.__proto__ = EventEmitter.prototype;

// Creates a Router from an Array of route definitions
// TODO: change this to event driven model
// emits: "contoller_name:action" on successful route
// controllers and the viewer listen to this object for instructions on doing shit
function Router() {

    EventEmitter.call(this);

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
    // TODO: ROBUSTNESS::::
    
    var method = request.method;
    var uri = URL.parse( request.url );

    console.log( '\nSERVER_LOG:: Router recieved request for: ', method, request.url, '\n'); // refractor logs

    var routeParams = this.get_dispatch_params( method, uri.pathname, uri.query );

    var controller = routeParams.controller;
    var action = routeParams.action || routeParams.file;
    var params = routeParams.params;

    this.emit( 'dispatchTo:'+controller, action, params, request, response );
    if (!request.handled_by_controller)
        this.emit( 'dispatchTo:application', action, params, request, response );

}

Router.prototype.get_dispatch_params = function( method, path, query) {
    var match = this.get_matched_route( method, path );
    var matched_route = match[0];
    var regex_captures = match[1];

    var params = this.get_static_file_params ||
        this.get_params_from_route( matched_route, regex_captures );
    _.extend(params.params, query);
    
    if (params.action == 'public') params.params.file = params.params.file || path;
    if (!params.controller) params.controller = matched_route[2].controller || 'home';
    if (!params.action) params.action = matched_route[2].action || 'index';

    return params;
}

Router.prototype.get_matched_route = function( method, path ) {
    for ( var i = 0; i < routes.length; i++ ) {

        // Check if the method matches first
        if ( method.toLowerCase() !== routes[i][0].toLowerCase() ) continue;

        // match the path - queries against the regex item in the route array
        var match = path.match( routes[i][1] );

        // Continue to next item if the route doesn't match the url
        if ( !match ) continue;
        match.shift();
        return [routes[i], match];
    }
    // no matched route. TODO: handle this
    return [null, null];
}

Router.prototype.get_params_from_route = function( matched_route, regex_captures ) {

    var route_params = {params: {}};
    for ( var j in matched_route[2] ) {
        if ( !regex_captures[j] ) continue;

        if( matched_route[2][j].match( /^file$/i ) ) {
            route_params.params.file = match[j];
        } else if ( matched_route[i][2][j].match( /^controller$/i ) ) {
            route_params.controller = match[j];
        } else if ( matched_route[i][2][j].match( /^action$/i ) ) {
            route_params.action = match[j];
        } else {
            route_params.params[ matched_route[i][2][j] ] = match[j];
        }
    }

    return route_params;

}

Router.prototype.get_static_file_params = function( matched_route ) {
    if ( matched_route[2].public ) return {
        action: 'public',
        controller: 'application',
        params: {}
    }
}

