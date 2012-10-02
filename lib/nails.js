// The file which configures the nails application
var http = require('http');
var cntrl = require('./controller.js').Controller;
var router = require('./router.js');

var application = {};
application.config = {};

exports.Nails = {
	application: application,
	Controller: cntrl,
	configure: configure,
	startServer: startServer
};
function configure( appConfig ) {

	application.router = new router.Router( appConfig.routes );
	application.router.controllers = appConfig.controllers;
	application.config = appConfig.config;
	application.mimes = appConfig.mimes;

}

function startServer( config ) {
	var server = http.createServer( function( req, res ) {
		application.router.route( req, res );
	});

	server.listen( application.config.PORT );	
}