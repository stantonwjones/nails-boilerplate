var Router = require('./lib/router.js');
var Controller = require('./lib/controller.js');
var Model = require('./lib/model.js');
// don't know what application would be for
// var Application = require('./lib/application.js');

exports.Router = Router.Router;
exports.Controller = Controller;
exports.configure = configure;

function route( method, url ) {
	if ( !router ) {
		throw "The router has not been initialized";
	}
}

function configure( config ) {

}