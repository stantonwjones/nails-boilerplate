// Initializes application before server starts
// Each of these is REQUIRED
import routes from './routes.js';
import mimes from './mimes.js';
import db from './db.js';

import path from 'node:path';
var SERVER_ROOT = path.resolve(import.meta.dirname, '..');
var APP_ROOT = path.resolve(SERVER_ROOT, 'server');

// Only for reading the certificates for SSL
import fs from 'node:fs';
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

  // Uncomment these to use serverside react view engine.
  //VIEW_ENGINE: require('express-react-views').createEngine(),
  //VIEW_ENGINE_EXT: 'jsx',

  // For HTTPS
  ENABLE_HTTPS: true,
  SSL_PORT: 3334,
  PRIVATE_KEY: PRIVATE_KEY_FILE,
  CERTIFICATE: CERTIFICATE_FILE,
};

export default {
  config,
  routes,
  mimes,
  db
}
