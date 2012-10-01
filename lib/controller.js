var _us = require('underscore');

exports.Controller = Controller;

// The base controller definition
function Controller( options ) {
	if ( !options.name ) throw 'Name required for Controller';

	// Initiate settings
	var defaults = {
	};
	var settings = _us.extend( {}, defaults, settings );

}
Controller.prototype = {

	index: function index() {
		this.getView( 'index' );
		// This should work (ideally)
		// this.getView();
	},
	/**
	 *	Retrieves view content for the controller action
	 *	TODO: CHECK THIS WORKS!!!!
	 */
	getView: function( view ) {
		var path = Nails.application.config.VIEWS_ROOT +
				[ '', this.name, (view) ? view : this.caller.name ].join('/');
		return fs.readFile( path );
	},

	/**
	 *	TODO: provide a method for handling errors
	 */
	404: function() {
		return {
			code: 404,
			header: {'Content-Type': 'text/plain'},
			content: 'Page Not Found'
		};
	},
	500: function() {
		return {
			code: 500,
			header: {'Content-Type': 'text/plain'},
			content: 'Internal Server Error'
		};
	}
}

function getView( controllerName ) {
}

