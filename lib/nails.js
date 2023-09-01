// The file which configures the nails application
const http = require('http');
const https = require('https');
const URL = require('url');
const path = require('path');
const fs = require('fs');
const domain = require('domain');
const EventEmitter = require('events').EventEmitter;

const Controller = require('./controller.js');
const Model = require('./model.js');
const ModelV2 = require('./model_v2.js');
const Router = require('./router.js');

const express_app = require('./application.js');

const models = {};

// TODO: add key value pairs to express app singleton.
var application = {};
application.config = {};

// TODO: this should return a function (the configure function).
// Calling the function should return { startServer: startServer }.
module.exports = nails;

function nails(app_config) {
  nails.config = app_config.config;
  application._onceConfigured = configure(app_config);
  return {startServer: startServer};
}

nails.application = express_app;
nails.Controller = Controller;
nails.Model = ModelV2;
nails.ModelDeprecated = Model;
nails.events = new EventEmitter();

async function configure( app_config ) {
  express_app.set('nails_config', application);
  application.config = app_config.config;
  // TODO: may not need mimes any more.
  application.mimes = app_config.mimes;

  // Init view engine. Defaults to ejs.
  express_app.set('view engine', 'ejs');
  if (app_config.config.VIEW_ENGINE) {
    if (typeof app_config.config.VIEW_ENGINE == "string") {
      console.log("using consolidate for some reason");
    }
    express_app.engine(
        app_config.config.VIEW_ENGINE_EXT,
        app_config.config.VIEW_ENGINE);
    express_app.set('view engine', app_config.config.VIEW_ENGINE_EXT);
  }
  express_app.set('views', app_config.config.VIEWS_ROOT);

  // set up router and controllers
  express_app.set("public_root", app_config.config.PUBLIC_ROOT);
  application.router = new Router( app_config.routes || [] );

  // init models
  var DBConnector = get_dbconnector(app_config.db.connector);

  // TODO: deprecate the old Model style
  if (app_config.config.MODELS_ROOT) {
    Model.set_connector(DBConnector, app_config.db);
    init_models(app_config.config.MODELS_ROOT);
  }
  // TODO: make this Model style mandatory
  if (DBConnector.connect && DBConnector.generateModelSuperclass) {
    await DBConnector.connect(app_config.db);
    ModelV2.setConnector(DBConnector);
  } else {
    // Try to instantiate DBConnector
    let dbConnector = new DBConnector();
    await dbConnector.connect(app_config.db);
    ModelV2.setConnector(dbConnector);
  }

  // init Controllers
  Controller.setRouter(application.router);
  application.controller = Controller.extend(ApplicationController);
  console.log('initializing controllers: ', app_config.config.CONTROLLERS_ROOT);
  init_controllers(app_config.config.CONTROLLERS_ROOT);
};

function startServer(config) {
    // Log the config.
    console.log(config);
    //await application._onceConfigured;
    console.log("CONFIGURATION COMPLETE");
    // TODO: Use logging middleware.
    application._onceConfigured.then(() => {
      // Use the router middleware.
      express_app.use(application.router.express_router);
      var ip = application.config.IP || 'localhost';
      var port = application.config.PORT || 3000;

      let startHttp = 'ENABLE_HTTP' in application.config && !!application.config.ENABLE_HTTP;
      let startHttps = !!application.config.ENABLE_HTTPS;

      if (!startHttp && !startHttps) {
        console.error("Either ENABLE_HTTPS or ENABLE_HTTP must be set for nails to start");
      }

      let atLeastOneServerStarted = false;
      let serverStartedCallback = () => {
            if (atLeastOneServerStarted) return;
            nails.events.emit("ready", null);
            atLeastOneServerStarted = true;
      }
      
      if (startHttp) {
          console.log("starting nails HTTP server. listening to ", ip + ':' + port);
          express_app.listen(port, ip, serverStartedCallback);

      }
      if (startHttps) {
        console.log(`starting nails HTTPS server. Listening to ${ip}:${application.config.SSL_PORT}`);
        https.createServer({
            key: application.config.PRIVATE_KEY,
            cert: application.config.CERTIFICATE
        }, express_app).listen(application.config.SSL_PORT, serverStartedCallback);
      }
    });
}

// TODO: create an initializer lib file.
function init_controllers(controller_lib) {
    init_app_lib(Controller, controller_lib);
}
function init_models(model_lib) {
    init_app_lib(Model, model_lib);
}
async function init_app_lib(superclass, abs_path) {
    console.log('attempting to import:', abs_path);
    if (!fs.existsSync(abs_path))
      return console.log('Cannot initialize. Path not found.', abs_path);
    if (fs.statSync(abs_path).isFile()) {
      let subclass = (await import(abs_path)).default;
      // Constructor function was provided
      if (!superclass.isPrototypeOf(subclass))
          return superclass.extend(subclass);
      // ES6 Class was provided
      return new subclass();
    }
    fs.readdirSync(abs_path).forEach(function(rel_path) {
        init_app_lib(superclass, path.join(abs_path, rel_path));
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
