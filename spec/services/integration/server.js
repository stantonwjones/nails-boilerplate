var nails = require('../../../index.js');

// See self-documented config files
var service_config = require('./config/service.js');
console.log("starting server")
nails( service_config ).startServer();
module.exports = nails; // export nails for testing
