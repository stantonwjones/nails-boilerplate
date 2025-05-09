// Initializes application before server starts
// Each of these is REQUIRED
import path from 'node:path';
import fs from 'node:fs';

var SERVER_ROOT = path.resolve(import.meta.dirname, '..');
var APP_ROOT = path.resolve(SERVER_ROOT, 'app');

// Only for reading the certificates for SSL
const PRIVATE_KEY_FILE = fs.readFileSync(`${__dirname}/ssl/key.pem`);
const CERTIFICATE_FILE = fs.readFileSync(`${__dirname}/ssl/certificate.pem`);

var config = {
  APP_ROOT: APP_ROOT,
  // root directory for delivering static assets
  PUBLIC_ROOT: SERVER_ROOT + '/public',
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

import routes from './routes.js';
import mimes from './mimes.js';
import db from './db.js';
export default {routes, mimes, db, config};
