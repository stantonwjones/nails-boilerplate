import Nails from '@projectinvicta/nails';

// See self-documented config files
import service_config from '../config/service.js';

const nails = new Nails(service_config);
await nails.startServer();
