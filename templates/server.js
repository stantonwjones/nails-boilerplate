var nails = require('nails-boilerplate');

// See self-documented config files
var service_config = require('./config/service.js');
nails( service_config ).startServer();
