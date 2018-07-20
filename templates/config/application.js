// Initializes application before server starts
// Each of these is REQUIRED
const SERVER_ROOT = __dirname + '/..';
const APP_ROOT = SERVER_ROOT + '/app';
const VIEW_ENGINE = 'ejs';

const config = {
  APP_ROOT: APP_ROOT,
  // root directory for delivering static assets
  PUBLIC_ROOT: SERVER_ROOT + '/public',
  CONTROLLERS_ROOT: APP_ROOT + '/controllers',
  VIEWS_ROOT: APP_ROOT + '/views',
  MODELS_ROOT: APP_ROOT + '/models',
  SERVER_ROOT: SERVER_ROOT,
  PORT: 3333,
  VIEW_ENGINE: VIEW_ENGINE,
  VIEW_ENGINE_PATH: require.resolve(VIEW_ENGINE),
  ASYNC: false
};

module.exports.routes = require( './routes.js' );
module.exports.mimes = require( './mimes.js' );
module.exports.db = require('./db.js');

module.exports.config = config;
