/**
 *	Routes specifies the array of route definitions to be passed to the router
 *
 *	Routes are checked in series, and the first matching route is applied.
 *	A route definition is as follows:
 *		['METHOD', 'REGEX', 'OPTIONS']
 *
 *		METHOD => crud methods (GET, PUT, POST, DELETE)
 *		REGEX  => to be matched against the path.  Captured elements will be passed to options.
 *		OPTIONS => an object with parametes deciding how the route will be handled in order of execution:
 *			path: => the path to a static file ( index.html f/e)
 *			controller: => controller to route the request to. TODO: May implement a resource definition for automatically routing cruds
 *			action: => the method to run in the controller. If not specified, the index method will be called.
 *			[1..n]: => each numerical definition defines a parameter in which to store the value of the captured elements in the regex.
 *						controller, and action are protected names and will apply the cature to controller name and method respectively.
 *						f/e: ['get', /\/(home)/, {0: 'controller'}] => routes to home controller
 *							 ['get, '/\/home\/(5)/, {controller: 'home', 0: 'id'}] => routes to home controller and adds {id: 5} to the params hash.
 */

var routes = [
	// Routes the root request to index.html, as well as all other requests to static
    ['get', "/", {public: true}],
    // Routes all requests starting with /public as static requests to the public folder.
    ['get', '/public', {public: true}],
	// A test route which routes the first part of pathname to controller and the second to the action
	['get', /^\/(\w+)\/(\w+)$/i, {0: 'controller', 1: 'action'}],
    // Maps the first two parts of the path to controller and action, and the third to the id parameter
    ['get', "/:controller/:action/:id"]
];

module.exports = routes;
