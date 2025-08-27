// var nails = require('../../../index.js');
import nails from '../../../index.js';
import service_config from './config/service.js';

// See self-documented config files
// var service_config = require('./config/service.js');
// console.log("starting server")
(await nails( service_config )).startServer();
export default nails; // export nails for testing
