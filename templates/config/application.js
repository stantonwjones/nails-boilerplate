// Initializes application before server starts
// Each of these is REQUIRED
var SERVER_ROOT = __dirname + '/..';
var APP_ROOT = SERVER_ROOT + '/app';
var ASSETS_ROOT = SERVER_ROOT + '/assets';
// TODO: in production, store assets in memory to avoid file reads
var ENV = 'development'; // So we can figure out whether to load compiled assets or not

// CONFIG OPTIONS USED BY NAILS TO DELIVER ASSETS AND TEMPLATES
var config = {
	ASSETS_ROOT: ASSETS_ROOT,
	JS_ROOT: ASSETS_ROOT + '/scripts',
	IMG_ROOT: ASSETS_ROOT + '/images',
	CSS_ROOT: ASSETS_ROOT + '/styles',
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
