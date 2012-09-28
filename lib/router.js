// The router object
var Eventer = require('events').EventEmitter;
var URL = require('url');

var router = new Eventer();

router.on('init', route);

// Creates a Router from an Array of route definitions
function Router( routes ) {

	this.route = route;

	function route( method, url ) {

		var uri = URL.parse( url );
		return getControllerActionParams( method, uri.pathname, uri.query );

	}

	function getControllerActionParams( method, pathname, query ) {
		for ( int i = 0; i < routes.length; i++ ) {
			var controller;
			var action;
			var params;
			var file;

			if ( method.toLowerCase() === routes[i][0].toLowerCase() ) {
				var match = pathname.match( new RegExp( '^' + routes[i][1] ) );

				if (!match) continue;
				for ( var j in routes[i][2] ) {

					if ( routes[i][2][j].match( /^(controller|action)$/i ) ) {
						controller = routes[i][2].controller;
						action = routes[i][2].action;
					}
					if ( !match[j] ) continue;
					params[ routes[i][2][j] ] = match[j];

				}

				// Set the file if the file parameter exists
				file = routes[i][2].file;

				// If the file parameter isn't set, try for the controller and actions parameters
				if (!file) {
					controller = routes[i][2].controller || controller;
					action = routes[i][2].action || action || 'index';
				}

			}

		}
	}

}