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
	render: function( response, template, params ) {
		response.writeHead( params.code || 200 );
		response.write( template(params) );
		response.end();
	},

	/**
	 *	TODO: provide a method for handling errors
	 */
	404: function( response ) {
		return {
			code: 404,
			header: {'Content-Type': 'text/plain'},
			content: 'Page Not Found'
		};
	},
	500: function( response ) {
		return {
			code: 500,
			header: {'Content-Type': 'text/plain'},
			content: 'Internal Server Error'
		};
	}
}

