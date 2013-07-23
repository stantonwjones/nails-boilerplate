var nails = require('../index.js');

// See self-documented config files
var application_config = require('./config/application.js');
nails.configure( application_config );
nails.startServer();
