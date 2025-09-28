// The file which configures the nails application
import http from 'node:http';
import https from 'node:https';
import URL from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import { EventEmitter } from 'node:events';

// const http = require('http');
// const https = require('https');
// const URL = require('url');
// const path = require('path');
// const fs = require('fs');
// const EventEmitter = require('events').EventEmitter;


import Controller from './controller.js';
import Model from './model.js';
import ModelV2 from './model_v2.js';
import Router from './router.js';

import express_app from './application.js';

const models = {};

// TODO: add key value pairs to express app singleton.
var application = {};
application.config = {};

// TODO: this should return a function (the configure function).
// Calling the function should return { startServer: startServer }.
// export defulat nails;

export default async function nails(app_config) {
  nails.config = app_config.config;
  application._onceConfigured = configure(app_config);
  await application._onceConfigured;
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
  console.log("Initializing Router...");
  // application.router = new Router( app_config.routes || [] );
  application.router = new Router( [] );
  console.log("Application Router initialized");

  // init models
  console.log("Initializing DB connection...");
  var DBConnector = await get_dbconnector(app_config.db.connector);

  // TODO: deprecate the old Model style
  if (app_config.config.MODELS_ROOT) {
    Model.set_connector(DBConnector, app_config.db);
    await init_models(app_config.config.MODELS_ROOT);
  }
  // TODO: make this Model style mandatory
  console.log("Connecting to DB...");
  if (DBConnector.connect && DBConnector.generateModelSuperclass) {
    console.log("Generating model superclass...");
    await DBConnector.connect(app_config.db);
    ModelV2.setConnector(DBConnector);
    await init_models_v2(app_config.config.MODELS_ROOT);
    DBConnector.afterInitialization();
  } else {
    console.log("Instantiating DBConnector...");
    // Try to instantiate DBConnector
    let dbConnector = new DBConnector();
    await dbConnector.connect(app_config.db);
    ModelV2.setConnector(dbConnector);
  }
  console.log("DB Connection complete");

  // init Controllers
  Controller.setRouter(application.router);
  application.controller = Controller.extend(ApplicationController);
  console.log('initializing controllers: ', app_config.config.CONTROLLERS_ROOT);
  await init_controllers(app_config.config.CONTROLLERS_ROOT);
  application.router.addRoutes(app_config.routes);
};

function startServer(config) {
    // Log the config.
    console.log(config);
    // await application._onceConfigured;
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
        console.log("Started");
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
async function init_controllers(controller_lib) {
  await init_app_lib(Controller, controller_lib);
}
async function init_models(model_lib) {
  await init_app_lib(Model, model_lib);
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
      const subInstance = new subclass();
      if (superclass == Controller) {
        subInstance._registerControllerRoutes();
      }
      return subInstance;
    }
    for (const rel_path of fs.readdirSync(abs_path)) {
      await init_app_lib(superclass, path.join(abs_path, rel_path));
    }
}

async function init_models_v2(abs_path) {
  if (!fs.existsSync(abs_path))
    return console.log('Cannot initialize. Path not found.', abs_path);
  if (fs.statSync(abs_path).isFile()) {
    console.log('attempting to import:', abs_path);
    // We just need to import each model once so the generateSuperclass
    // method is called at least once for each model.
    let modelClass = (await import(abs_path)).default;
    console.log('imported model:', modelClass.name);
    // // Constructor function was provided
    // if (!superclass.isPrototypeOf(subclass))
    //     return superclass.extend(subclass);
    // ES6 Class was provided
    return;
  }
  const directory_contents = fs.readdirSync(abs_path);
  for (const rel_path of directory_contents) {
      await init_models_v2(path.join(abs_path, rel_path));
  };
}

// retrieves the connector object. If cannot
// require the module with the same name,
// try grabbing connector from lib
// (default connectors)
async function get_dbconnector(connector_name) {
  console.log("Getting DBConnector:", connector_name);
    var DBConnector;
    //TODO: put mongodbconnector in its own module
    try {
        DBConnector = (await import(connector_name)).default;
    } catch(e) {
        DBConnector = (await import('./'+connector_name)).default;
    }
    console.log("Got DBConnector:", DBConnector.name);
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
