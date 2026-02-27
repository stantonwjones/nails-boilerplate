import { type RoutesConfig } from '@projectinvicta/nails';

const routes: RoutesConfig = [
	// Routes the root request to index.html, as well as all other requests to static
  ['get', "/", {controller: 'home'}],
  // Routes all requests starting with /public as static requests to the public folder.
  ['get', '/public', {public: true}],

	// A test route which routes the first part of pathname to controller and the second to the action
	// ['get', /^\/(\w+)\/(\w+)$/i, {0: 'controller', 1: 'action'}],

  // Maps the first two parts of the path to controller and action, and the third to the id parameter
  // ['get', "/:controller/:action/:id"],

  // For all other GET requests, render HomeController#index
  ['get', '/:catchall', {controller: 'home'}],

  // Defines a WebSocket handler
  // ['ws', "/:controller/:action/:id"]
];

export default routes;
