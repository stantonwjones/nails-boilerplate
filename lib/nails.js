// The file which configures the nails application
var http = require('http');
var Controller = require('./controller.js').Controller;
var Router = require('./router.js');
var Responder = require('./responder.js');

var application = {};
application.config = {};

module.exports = {
    application: application,
    Controller: Controller,
    configure: configure,
    startServer: startServer
};

function configure( appConfig ) {

    application.router = new Router( appConfig.routes );
    application.responder = new Responder( appConfig.mimes );
    application.config = appConfig.config;
    application.mimes = appConfig.mimes;
    application.controller = new Controller({name: 'applicationController'});

};

function startServer( config ) {

    // TODO: refractor the server to its own module
    var server = http.createServer( function( req, res ) {
        try {
            application.responder.wrap_response( res );
            application.router.route( req, res );
        } catch (exception) {
            application.controller._do( 500, exception, req, res );
        }
    });

    server.listen( application.config.PORT );

}
