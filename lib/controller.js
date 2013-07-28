var _us = require('underscore');
var fs = require('fs');
var events = require('events');

var router;
var controller_proto

// TODO: refractor error generation
var NAME_REQUIRED_ERROR = function() {
    return new Error(
        'FATAL ERROR::: Named function required for Controller constructor method'
    );
}

module.exports = Controller

// The base controller definition
function Controller() {}

Controller.setRouter = function(router_singleton) {
    Controller.router = router = router_singleton;
}
// may not need setmimes
Controller.setMimes = function( mimes_config ) {
}
Controller.extend = function(constructor) {
    console.log('extending', constructor.name);
    if ( !constructor.name ) throw NAME_REQUIRED_ERROR();
    controller_proto = controller_proto || new Controller();
    constructor.prototype.__proto__ = controller_proto;
    var constructed = new constructor();

    // configure event listeners on router.
    var controller_name = constructor.name.toLowerCase();
    router.removeAllListeners('dispatchTo:' + controller_name);
    router.on( 'dispatchTo:' + controller_name, constructed._do.bind(constructed) );

    return constructed;
}

/****  Network Methods  *****/
/**
 *  The main entry function of the controller.
 *
 *  @param {string} action      The action called for this controller
 *  @param {object} params     The parameter hash for this action
 *  @param {object} request     The http request object from the http server
 *  @param {object} response    The http response object from the http server
 */
Controller.prototype._do = function( action, params, request, response ) {
    //this.emit( '_do', action, params, request, response );
    //this._generateResponse( action, params, request, response );
    request.handled_by_controller = true;
    var doAction = this[action];
    console.log(this.constructor.name, 'doing', action);
    if (typeof doAction != 'function') {
        params.error = new Error('Action not Available');
        this['404'](params, request, response);
    } else {
        try {
            doAction(params, request, response);
        } catch(e) {
            // TODO: look into domains for handle server errors
	        params.error = e;
            this['500'](params, request, response);
        }
    }
}

/** 
 *  The default route for public files 
 */
Controller.prototype.public = function(params, request, response ) {
    console.log('requested public:', request.path);
    response.public({path: request.path});
}

/**
 *  The default handler for a 404 error code
 */
Controller.prototype['404'] = function(params, request, response) {
    //this._render('404');
    response.setHeader('content-type', 'text/plain');
    response.statusCode = 404;
    response.end('Page Not Found');
}

/**
 *  The default handler for a 500 error code
 */
Controller.prototype['500'] = function(params, request, response) {
    //this._render('404');
    // Check if the stack has been passed along
    var error = params.error;
    var stackTrace = error.stack || '' || error;
    console.log('error with params', params);

    response.setHeader('content-type', 'text/plain');
    response.statusCode = 500;
    response.end('Internal Server Error\n\n' + stackTrace);
}

/***** UTILITY FUNCTIONS *****/
// Eventer accessor methods
Controller.prototype.error = function() {
    this.emit('error', arguments);
}
