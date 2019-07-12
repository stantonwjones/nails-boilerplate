var nails = require('../index.js');

// See self-documented config files
var service_config = require('./config/service.js');
nails( service_config ).startServer();
