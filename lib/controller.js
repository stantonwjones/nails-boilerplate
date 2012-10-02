var _us = require('underscore');
var fs = require('fs');

exports.Controller = Controller;

// The base controller definition
/**
 *	The cotroller renders static assets and templates using the parameters
 *	passed to the member functions.
 */
function Controller( options ) {
	if ( !options.name ) throw 'Name required for Controller';

	// Initiate settings
	var defaults = {
	};
	var settings = _us.extend( {}, defaults, settings );

	/**
	 *	TODO: EVENTER AND ACCESSOR METHODS WOULD GO HERE
	 */
	 // var eventer = ...;

}
Controller.prototype = {

	index: function index( params ) {
		var content = this.getView( 'index' );
		console.log( content );
		return {
			code: 200,
			header: {'Content-Type': 'text/plain'},
			content: content
		}
		// This should work (ideally)
		// this.getView();
	},
	/**
	 *	Hook for serving a file. Use if the file parameter exists
	 */
	file: function( params ) {
		// TODO: Abstract path concatenation into its own file which worries about slashes (/)
		var path = params.path ? params.path + '/' + params.file : '/' + params.file;
		var content = this.getAsset( params.type, path );
		// TODO: abstract these objects out to a function
		// success/fail/redirect, etc.
		return {
			code: 200,
			header: {'Content-Type': 'text/plain'},
			content: content
		}
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
	},

	/***** UTILITY FUNCTIONS *****/
	/**
	 *	Retrieves view content for the controller action
	 *	TODO: CHECK THIS WORKS!!!!
	 */
	getView: function( view ) {
		var path = Nails.application.config.VIEWS_ROOT +
				[ '', this.name, (view) ? view : this.getView.caller.name ].join('/');
		return fs.readFileSync( filePath, 'utf8' );
	},

	/**
	 *	Change this to get asset and accept a type option
	 */
	getStyle: function(  ) {

	},

	/**
	 *	Returns a static asset
	 */
	getAsset: function( type, path ) {
		var filePath = this.rootPathForType(type) + path;
		return fs.readFileSync( filePath, 'utf8' );
	},

	/**
	 *	Returns the path for a specific file type
	 *
	 *	@param {string} type Can be html, css, js, image, video
	 */
	rootPathForType: function( type ) {
		var config = Nails.application.config;
		console.log(type);
		console.log(config.STATIC_ROOT);
		if (!type) return config.STATIC_ROOT;
		return {
			html: config.STATIC_ROOT,
			css: config.CSS_ROOT,
			image: config.IMG_ROOT,
			js: config.JS_ROOT
		}[type];
	}

}

function getView( controllerName ) {
}

