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
 *			file: => the path to a static file ( .html to pages, .js to js, ect.)
 *			controller: => controller to route the request to. TODO: May implement a resource definition for automatically routing cruds
 *			action: => the method to run in the controller. If not specified, the index method will be called.
 *			[0..n]: => each numerical definition defines a parameter in which to store the value of the captured elements in the regex.
 *						controller, and action are protected names and will apply the cature to controller name and method respectively.
 *						f/e: ['get', '/(home)/', {0: 'controller'}] => routes to home controller
 *							 ['get, '/home/(5), {controller: 'home', 0: 'id'}] => routes to home controller and adds 5 to the params hash.
 */

var routes = [
	['get', '/', {file: 'index.html'}]
];