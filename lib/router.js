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

		console.log( '\nSERVER_LOG:: Router recieved request for: ', method, url, '\n');
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
			var match = pathname.match( routes[i][1] );

			// Continue to next item if the route doesn't match the url
			if ( !match ) continue;

			// If the route matches, iterate through the keys of the rules portion of the route
			// ( the third item in the route array )
			for ( var j in routes[i][2] ) {

				if ( !match[j] ) continue;

				// Set the Controller, Action, File, or Parameter
				if( routes[i][2][j].match( /^file$/i ) ) {
					file = match[j];
				} else if ( !file && routes[i][2][j].match( /^controller$/i ) ) {
					controller = controller || match[j];
				} else if ( !file && routes[i][2][j].match( /^action$/i ) ) {
					action = action || match[j];
				} else {
					params[ routes[i][2][j] ] = match[j];
				}

			}

			// Set the file if the file parameter exists
			file = file || routes[i][2].file;

			// If the file parameter isn't set, try for the controller and actions parameters
			if (!file) {
				controller = controller || routes[i][2].controller || 'home';
				action = action || routes[i][2].action || 'index';
			}

			console.log( 'Request routed at: ' + (new Date()) );
			console.log( 'query string: ', query );
			console.log( 'file: ', file);
			console.log( 'controller: ', controller);
			console.log( 'action: ', action);
			console.log( 'params: ', params);
			console.log( '----------END ROUTING--------');

			// Break out of the loop through routes once the first match is found
			break;

		}

		// TODO: actually return some values, or pass directly to controllers
	}

}