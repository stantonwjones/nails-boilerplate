// The file which configures the nails application
var http = require('http');
var Controller = require('./controller.js');
var Router = require('./router.js');

var application = {};
application.config = {};

module.exports = {
    application: application,
    Controller: Controller,
    configure: configure,
    startServer: startServer
};

function configure( appConfig ) {

    application.router = new Router();
    application.router.setRoutes(appConfig.routes || []);
    Controller.setRouter(application.router);
    initControllers(appConfig.controllers);
    application.config = appConfig.config;
    application.mimes = appConfig.mimes;
    application.controller = new Controller(ApplicationController);

}

function startServer( config ) {

    console.log(config);

    // TODO: refractor the server to its own module
    var server = http.createServer( function( req, res ) {
        try {
            boostrap_request(req);
            application.router.route( req, res );
        } catch (exception) {
            console.log('got an exception', exception.message + '\n\n' + exception.stack);
            application.controller._do( 500, exception, req, res );
        }
    });

    server.listen( application.config.PORT );

}

function bootstrap_request(request) {
    var method = request.method;
    var uri = URL.parse( request.url );
    request.path = uri.pathname;
    request.query = uri.query;
}

function initControllers(controller_lib) {
    for (var controller in controller_lib) {
	if (typeof controller == 'object') {
	    initControllers(controller);
	    continue;
	}
	if (typeof controller == 'function') new Controller(controller);
    }
}

function ApplicationController(){};
