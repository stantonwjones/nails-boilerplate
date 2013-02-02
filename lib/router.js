// The Router object which handles incoming urls and executes the correct
// server-side logic based on the matching route in the Routing Table
// ( See example/config/routes.js or config/routes.js for a description of the routes )

//var Eventer = require('events').EventEmitter;
var URL = require('url');
exports.Router = Router;

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
        dispatch.call( this, routeParams, request, response );

	}

	// Dispatch the route to the correct controller/action pair or asset
	function dispatch( routeParams, request, response ) {
        var controller = routeParams.controller;
        var action = 'file';
        var params = routeParams.params;

        // Set the dynamic action if one exists
        if ( routeParams.action && controller ) {
            action = routeParams.action;
        }

        // If no controller has been found, trigger a 404 on the application controller
        if ( !controller ) {
            controller = 'ApplicationController';
            params = routeParams;
            if ( !routeParams.file ) {
                // TODO: if no file specified, should probs raise malformed request error
                // TODO: handle shit
                action = '404';
            }
        }

        this.emit( 'dispatch:'+controller, action, params, request, response );

	}

	// Should get the parameters to either return a file directly or be processed by the controllers
	function getControllerActionParams( method, pathname, query ) {
		// init variables
        // Eventually abstract the object return with its own functions/Constructor/Validations
		var file;
		var path;
		var controller;
		var action;
        var ext;
		var params = {};

/*      use different setting for public folders. Maybe put it in a route at the top
        // Check if the pathname is for a static asset. (All requests with a file extension are considered static asset requests)
        var isAsset = pathname.match( /\.(\w+)$/ );
        if (isAsset) {
            var splitURL = pathname.split('/');
            file = splitURL.splice(splitURL.length - 1, 1)[0];
            path = splitURL.join('/');
            ext = isAsset[1];

            // Log as asset request
            console.log('\nSTATIC ASSET REQUEST::::');
            console.log('Request accepted for asset: ', path + '/' + file, '\n');
        }
        */

		// Begin iterating through routes unless a static file was requested
		for ( var i = 0; i < routes.length && !isAsset; i++ ) {

			// Check if the method matches first
			if ( method.toLowerCase() !== routes[i][0].toLowerCase() ) continue;

			// match the path - queries against the regex item in the route array
			var match = pathname.match( routes[i][1] );

			// Continue to next item if the route doesn't match the url
			if ( !match ) continue;
            
            // first check if public (this may be a reserved name)
            if (routes[i][2].public) {
                // return the file associated with the public folder.
                this.emit('dispatch:public', /*path i guess...*/null);
                return; //either assume that the viewer is listening or allow ApplicationController to handle it
            }

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

			// Set the file/controller/action from the respective route options.
			// Explicitly defined file names will be overridden by captured versions.
			// Set the file if the file parameter exists
			file = file || routes[i][2].file;
            //ext = file.match( /\.(\w+)$/ )[1];

			// If the file parameter isn't set, try for the controller and actions parameters
			if (!file) {
				controller = controller || routes[i][2].controller || 'home';
				action = action || routes[i][2].action || 'index';
			}

			// Break out of the loop through routes once the first match is found
			break;

		}

		// TODO: actually return some values, or pass directly to controllers
		// TODO: handle 404s

		console.log( 'Request routed at: ' + ( new Date() ) );
		console.log( 'query string: ', query );
		console.log( 'file: ', file );
		console.log( 'controller: ', controller );
		console.log( 'action: ', action );
		console.log( 'params: ', params );
        console.log( 'ext: ', ext );
		console.log( '----------END ROUTING--------' );

		return {
			file: file,
			controller: controller,
			action: action,
            ext: ext,
			params: params
		};
	}
}

Router.prototype = new require('events').EventEmitter();
