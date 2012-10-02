// Initializes application before server starts
var SERVER_ROOT = __dirname + '/..';
var APP_ROOT = SERVER_ROOT + '/app';
var ASSETS_ROOT = SERVER_ROOT + '/assets';

// CONFIG OPTIONS USED BY NAILS TO DELIVER ASSETS AND TEMPLATES
var config = {
	ASSETS_ROOT: ASSETS_ROOT,
	JS_ROOT: ASSETS_ROOT + '/js',
	IMG_ROOT: ASSETS_ROOT + '/imgs',
	CSS_ROOT: ASSETS_ROOT + '/css',
	STATIC_ROOT: ASSETS_ROOT + '/pages',
	APP_ROOT: APP_ROOT,
	SERVER_ROOT: SERVER_ROOT,
	PORT: 3333
};

exports.routes = require( './routes.js' ).routes;
exports.mimes = require( './mimes.js' ).mimes;
exports.controllers = require( APP_ROOT + '/controllers' );
// TODO: implement models
//exports.MODELS = require( APP_ROOT + '/models' );
// TODO: precompile templates using underscore in staging and production
// TODO: in dev, load templates on request
//exports.VIEWS = require( APP_ROOT + '/views' );

exports.config = config;