// The file which configures the nails application
var http = require('http');
var URL = require('url');
var path = require('path');
var fs = require('fs');
var Controller = require('./controller.js');
var View = require('./view.js');
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

function configure( app_config ) {
    application.config = app_config.config;
    application.mimes = app_config.mimes;

    // set up responder and views;
    application.responder = new Responder( app_config.mimes );
    View.set_responder(application.responder);
    application.jsonview = new View(JSONView);
    application.publicview = new View(PublicView);
    init_views(app_config.views);

    // set up router and controllers
    application.router = new Router( app_config.routes || [] );
    Controller.setRouter(application.router);
    application.controller = new Controller(ApplicationController);
    init_controllers(app_config.controllers);

};

function startServer( config ) {

    console.log(config);

    // TODO: refractor the server to its own module
    var server = http.createServer( function( req, res ) {
        try {
            bootstrap_request(req);
            application.responder.wrap_response( res );
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

// TODO: change these to only take a root folder.  Use fs to include views and controllers implicitly.
function init_controllers(controller_lib) {
    init_app_lib(Controller, controller_lib);
}
function init_views(view_lib) {
    init_app_lib(View, view_lib);
}
function init_app_lib(base_constructor, lib) {
    for (var constructor in lib) {
        if (typeof constructor == 'object') {
            init_app_lib(base_constructor, constructor);
            continue;
        }
        if (typeof constructor == 'function') new base_constructor(constructor);
    }
}

// Define default views and controllers
function ApplicationController(){};
function JSONView(){};
// TODO: clean this up... all this logic shouldnt be here
function PublicView(){};
PublicView.prototype.get_full_path = function(filepath) {
    var pubroot = application.config.PUBLIC_ROOT;
    var partial_path = filepath;
    if (filepath.substr(0, pubroot.length) != pubroot)
        partial_path = path.join(pubroot, filepath);
    return path.join(application.config.SERVER_ROOT, partial_path);
};
PublicView.prototype.render = function(params, response) {
    var file_path = this.get_full_path(params.path);

    var content = '';
    try {
        content = fs.readFileSync(file_path);
    } catch(e) {
        console.log(e.message, "\n",  e.stack);
        response.statusCode = 404;
    } finally {
        response.end(content);
    }
};
