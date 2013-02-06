// The Router object which handles incoming urls and executes the correct
// server-side logic based on the matching route in the Routing Table
// ( See example/config/routes.js or config/routes.js for a description of the routes )

//var Eventer = require('events').EventEmitter;
var URL = require('url');
module.exports = Router;

Router.prototype = new (require('events').EventEmitter)();

// Creates a Router from an Array of route definitions
// TODO: change this to event driven model
// emits: "contoller_name:action" on successful route
// controllers and the viewer listen to this object for instructions on doing shit
function Router( routes ) {
    var self = this;

	this.route = route;

	function route( request, response ) {
        // TODO: ROBUSTNESS::::
        // dont need controllers stored here anymore
		//if ( !(this.controllers) ) throw 'No controllers initialized.';
		var method = request.method,
			url = request.url;

		// Parse the url into it's parts to be passed to routing functions
		console.log( '\nSERVER_LOG:: Router recieved request for: ', method, url, '\n'); // refractor logs
		var uri = URL.parse( url );

		// Get the routeParams hash for this route
		var routeParams =  getControllerActionParams( method, uri.pathname, uri.query, request, response );

        // Dispatch the routeParams to a controller
        dispatch.call( self, routeParams, request, response );

	}

	// Dispatch the route to the correct controller/action pair or asset
	function dispatch( routeParams, request, response ) {
        var controller = routeParams.controller;
        var action = routeParams.action || routeParams.file;
        var params = routeParams.params;

        // If no controller has been found, trigger a 404 on the application controller
        /*
        if ( !controller ) {
            controller = 'ApplicationController';
            params = routeParams;
            if ( !routeParams.file ) {
                // TODO: if no file specified, should probs raise malformed request error
                // TODO: handle shit
                action = '404';
            }
        }
        */
        // let verifyRoute check for missing controller

        self.emit( 'dispatchTo:'+controller, action, params, request, response );
        // if the emits are handled synchronously, then simplify the next line greatly
        self.emit( 'verifyRoute', controller, request, response );

	}

	// Should get the parameters to either return a file directly or be processed by the controllers
	function getControllerActionParams( method, pathname, query ) {
		// init variables
        // Eventually abstract the object return with its own functions/Constructor/Validations
		var controller;
		var action;
		var params = {};

		// Begin iterating through routes
		for ( var i = 0; i < routes.length; i++ ) {

			// Check if the method matches first
			if ( method.toLowerCase() !== routes[i][0].toLowerCase() ) continue;

			// match the path - queries against the regex item in the route array
			var match = pathname.match( routes[i][1] );

			// Continue to next item if the route doesn't match the url
			if ( !match ) continue;
            
            // first check if public (this may be a reserved name)
            var isStatic = !!routes[i][2]['public'];
            console.log(routes[i][2]['public']);
            // if static file request, set file to pathname and break out
            if (isStatic) {
                controller = 'ApplicationController';
                action = 'file';
                // remove any .. or . from path here
                params.file = pathname;
                break;
            }

			// If the route matches, iterate through the keys of the rules portion of the route
			// ( the third item in the route array )
			for ( var j in routes[i][2] ) {
                // do nothing if static file request
                //if ( isStatic ) break;
				if ( !match[j] ) continue;

				// Set the Controller, Action, File, or Parameter
				if( routes[i][2][j].match( /^file$/i ) ) {
                    // remove the file part.  Delegate it to public foler functionality.
					file = match[j];
				} else if ( !file && routes[i][2][j].match( /^controller$/i ) ) {
					controller = controller || match[j];
				} else if ( !file && routes[i][2][j].match( /^action$/i ) ) {
					action = action || match[j];
				} else {
					params[ routes[i][2][j] ] = match[j];
				}

			}

			// If the file parameter isn't set, try for the controller and actions parameters
			//if (!file) {
			controller = controller || routes[i][2].controller || 'home';
			action = action || routes[i][2].action || 'index';
			//}

			// Break out of the loop through routes once the first match is found
			break;

		}

		console.log( 'Request routed at: ' + ( new Date() ) );
		console.log( 'query string: ', query );
		console.log( 'file: ', params.file );
		console.log( 'controller: ', controller );
		console.log( 'action: ', action );
		console.log( 'params: ', params );
		console.log( '----------END ROUTING--------' );

		return {
			controller: controller,
			action: action,
			params: params
		};
	}
}

