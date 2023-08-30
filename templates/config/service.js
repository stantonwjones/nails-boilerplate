// Initializes application before server starts
// Each of these is REQUIRED
var SERVER_ROOT = __dirname + '/..';
var APP_ROOT = SERVER_ROOT + '/app';

// Only for reading the certificates for SSL
const fs = require('fs');
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

module.exports.routes = require('./routes.js');
module.exports.mimes = require('./mimes.js');
module.exports.db = require('./db.js');

module.exports.config = config;
