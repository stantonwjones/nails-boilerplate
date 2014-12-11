var nails = require('../index.js');

// See self-documented config files
var application_config = require('./config/application.js');
nails( application_config ).startServer();
