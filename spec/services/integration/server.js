import Nails from '../../../index.ts';
import service_config from './config/service.js';

// See self-documented config files
// var service_config = require('./config/service.js');
const nails = new Nails(service_config);
await nails.startServer();
export default nails; // export nails for testing
