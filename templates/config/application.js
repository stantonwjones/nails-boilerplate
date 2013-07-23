// Initializes application before server starts
// Each of these is REQUIRED
var SERVER_ROOT = __dirname + '/..';
var APP_ROOT = SERVER_ROOT + '/app';

var config = {
    // root directory for delivering static assets
    PUBLIC_ROOT: '/public',
    CONTROLLERS_ROOT: APP_ROOT + '/controllers',
    VIEWS_ROOT: APP_ROOT + '/views',
	APP_ROOT: APP_ROOT,
	SERVER_ROOT: SERVER_ROOT,
	PORT: 3333
};

module.exports.routes = require( './routes.js' );
module.exports.mimes = require( './mimes.js' );

module.exports.config = config;
