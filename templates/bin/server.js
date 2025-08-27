import nails from 'nails-boilerplate';

// See self-documented config files
import service_config from '../config/service.js';

(await nails( service_config )).startServer();
