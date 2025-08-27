// Initializes application before server starts
// Each of these is REQUIRED

import routes from './routes.js';
import mimes from './mimes.js';
import db from './db.js';

var SERVER_ROOT = import.meta.dirname + '/..';
var APP_ROOT = SERVER_ROOT + '/server';

// Only for reading the certificates for SSL
import fs from 'node:fs';
// const fs = require('fs');
const PRIVATE_KEY_FILE = fs.readFileSync(`${import.meta.dirname}/ssl/key.pem`);
const CERTIFICATE_FILE = fs.readFileSync(`${import.meta.dirname}/ssl/certificate.pem`);

var config = {
  APP_ROOT: APP_ROOT,
  // root directory for delivering static assets
  PUBLIC_ROOT: SERVER_ROOT + '/client',
  CONTROLLERS_ROOT: APP_ROOT + '/controllers',
  VIEWS_ROOT: APP_ROOT + '/views',
  //MODELS_ROOT: APP_ROOT + '/models',
  SERVER_ROOT: SERVER_ROOT,

  ENABLE_HTTP: true,
  //IP: "0.0.0.0",
  PORT: 3333,

  ASYNC: false,

  // For HTTPS
  ENABLE_HTTPS: true,
  SSL_PORT: 3334,
  PRIVATE_KEY: PRIVATE_KEY_FILE,
  CERTIFICATE: CERTIFICATE_FILE,
};

// module.exports.routes = require('./routes.js');
// module.exports.mimes = require('./mimes.js');
// module.exports.db = require('./db.js');

export default {
  config,
  routes,
  db,
  mimes,
}
