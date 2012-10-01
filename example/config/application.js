// Initializes application before server starts
var SERVER_ROOT = __dirname + '/..';
var APP_ROOT = SERVER_ROOT + '/app';
var ASSETS_ROOT = SERVER_ROOT + '/assts';

var config = {
	ASSETS_ROOT: ASSETS_ROOT,
	APP_ROOT: APP_ROOT,
	SERVER_ROOT: SERVER_ROOT,
	PORT: 3333
}

exports.routes = require( './routes.js' ).routes;
exports.CONTROLLERS = require( APP_ROOT + '/controllers' );
// TODO: implement models
//exports.MODELS = require( APP_ROOT + '/models' );
// TODO: precompile templates using underscore in staging and production
// TODO: in dev, load templates on request
//exports.VIEWS = require( APP_ROOT + '/views' );

exports.config = config;



