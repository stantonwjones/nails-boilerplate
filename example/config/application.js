// Initializes application before server starts
var SERVER_ROOT = __dirname + '/..';
var APP_ROOT = SERVER_ROOT + '/app';
var ASSETS_ROOT = SERVER_ROOT + '/assts';

exports.SERVER_ROOT = SERVER_ROOT;
exports.ROUTES = require( './routes.js' ).routes;

exports.APP_ROOT = APP_ROOT;
//exports.CONTROLLERS = require( APP_ROOT + '/controllers' );
//exports.MODELS = require( APP_ROOT + '/models' );
//exports.VIEWS = require( APP_ROOT + '/views' );

