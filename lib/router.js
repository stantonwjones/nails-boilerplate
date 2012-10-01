// The Router object which handles incoming urls and executes the correct
// server-side logic based on the matching route in the Routing Table
// ( See example/config/routes.js or config/routes.js for a description of the routes )

//var Eventer = require('events').EventEmitter;
var URL = require('url');
exports.Router = Router;

// Creates a Router from an Array of route definitions
function Router( routes ) {

	this.route = route;

	function route( method, url ) {

		var uri = URL.parse( url );
		return getControllerActionParams( method, uri.pathname, uri.query );

	}

	// Should get the parameters to either return a file directly or be processed by the controllers
	function getControllerActionParams( method, pathname, query ) {
		// init variables
		var file;
		var controller;
		var action;
		var params = {};

		// Begin iterating through routes
		for ( var i = 0; i < routes.length; i++ ) {

			// Check if the method matches first
			if ( method.toLowerCase() !== routes[i][0].toLowerCase() ) continue;

			// match the path - queries against the regex item in the route array
			var match = pathname.match( new RegExp( '^' + routes[i][1] ) );

			// Continue to next item if the route doesn't match the url
			if ( !match ) continue;

			// If the route matches, iterate through the keys of the rules portion of the route
			// ( the third item in the route array )
			for ( var j in routes[i][2] ) {

				if( routes[i][2][j].match( /^file$/ ) ) {

					file = routes[i][2][j];
					break;

				}

				if ( routes[i][2][j].match( /^(controller|action)$/i ) ) {
					controller = routes[i][2].controller;
					action = routes[i][2].action;
				}
				if ( !match[j] ) continue;
				params[ routes[i][2][j] ] = match[j];

			}

			// Set the file if the file parameter exists
			file = file || routes[i][2].file;

			// If the file parameter isn't set, try for the controller and actions parameters
			if (!file) {
				controller = routes[i][2].controller || controller;
				action = routes[i][2].action || action || 'index';
			}

			console.log( 'Request routed at: ' + (new Date()) );
			console.log( 'method: ', method, ' path: ', pathname);
			console.log( 'query string: ', query );
			console.log( 'file: ', file);
			console.log( 'controller: ', controller);
			console.log( 'action: ', action);
			console.log( 'params: ', params);

			// Break out of the loop through routes once the first match is found
			break;

		}
	}

}