import repl from 'repl';
import Nails from '@projectinvicta/nails';
import service_config from '../config/service.js';

console.log("Initializing Nails for REPL...");

const nails = new Nails(service_config);
await nails.initialized;

console.log("Nails initialized!");
console.log("The 'nails' instance (and nails.Models) is available in the context.");

const replServer = repl.start({
  prompt: 'nails> '
});

replServer.context.nails = nails;
