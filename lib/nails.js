// The file which configures the nails application
var http = require('http');
var URL = require('url');
var path = require('path');
var fs = require('fs');
var domain = require('domain');

var Controller = require('./controller.js');
var Model = require('./model.js');
var View = require('./view.js');
var Router = require('./router.js');
var Responder = require('./responder.js');
var Cookies = require('./cookies.js');

var express_app = require('./application.js');

var models = {};

// TODO: add key value pairs to express app singleton.
var application = {};
application.config = {};

// TODO: this should return a function (the configure function).
// Calling the function should return { startServer: startServer }.
module.exports = nails;

function nails(app_config) {
    configure(app_config);
    return {startServer: startServer};
}

nails.application = application;
nails.Controller = Controller;

function configure( app_config ) {
    application.config = app_config.config;
    application.mimes = app_config.mimes;

    // set up responder and views;
    // TODO: init internal views and controllers by importing them
    // from application/views
    // or application/controllers folder
    /* DONT NEED THESE
    application.responder = new Responder( app_config.mimes );
    View.set_responder(application.responder);
    application.jsonview = new View.extend(JSONView);
    application.publicview = new View.extend(PublicView);
    application.errorview = new View.extend(ErrorView);
    */
    //init_views(app_config.config.VIEWS_ROOT);

    // set up router and controllers
    express_app.set("public_root", app_config.config.PUBLIC_ROOT);
    application.router = new Router( app_config.routes || [] );

    // init Controllers
    Controller.setRouter(application.router);
    application.controller = Controller.extend(ApplicationController);
    console.warn('initializing controllers: ', app_config.config.CONTROLLERS_ROOT);
    init_controllers(app_config.config.CONTROLLERS_ROOT);

    // init models
    var DBConnector = get_dbconnector(app_config.db.connector);
    Model.set_connector(DBConnector, app_config.db);
    init_models(app_config.config.MODELS_ROOT);

};

function startServer(config) {
    // Log the config.
    console.log(config);
    
    // TODO: Use logging middleware.
    
    // Use the router middleware.
    express_app.use(application.router.express_router);
    express_app.listen(3000);
}

// TODO: create an initializer lib file.
function init_controllers(controller_lib) {
    init_app_lib(Controller, controller_lib);
}
function init_views(view_lib) {
    init_app_lib(View, view_lib);
}
function init_models(model_lib) {
    init_app_lib(Model, model_lib);
}
function init_app_lib(base_constructor, abs_path) {
    console.log('attempting to import:', abs_path);
    if (fs.statSync(abs_path).isFile()) return base_constructor.extend( require(abs_path) );
    fs.readdirSync(abs_path).forEach( function(rel_path) {
        init_app_lib(base_constructor, path.join(abs_path, rel_path));
    });
}

// retrieves the connector object. If cannot
// require the module with the same name,
// try grabbing connector from lib 
// (default connectors)
function get_dbconnector(connector_name) {
    var DBConnector;
    //TODO: put mongodbconnector in its own module
    try {
        DBConnector = require(connector_name);
    } catch(e) {
        DBConnector = require('./'+connector_name);
    }
    return DBConnector;
}

// Define default views and controllers
// TODO: clean this up... all this logic shouldnt be here
function ApplicationController(){};

/**
 * Application Views
 */
function JSONView(){};
// TODO: add error template for error view
function ErrorView() {}
ErrorView.prototype.render = function(params, response) {
    response.statusCode = params.code || 500;
    // TODO: change this to use the error jade template
    response.setHeader('content-type', 'text/plain');
    var content = params.error ?
        params.error.message + '\n' + params.error.stack :
        params.message;
    response.end(content);
}
// TODO: consider changing public to static...
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
