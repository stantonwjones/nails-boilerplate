var fs = require('fs');
var events = require('events');

var router;
var controller_proto
var models;

// TODO: refractor error generation
var NAME_REQUIRED_ERROR = function() {
    return new Error(
        'FATAL ERROR::: Named function required for Controller constructor method'
    );
}

module.exports = Controller;

// The base controller definition
function Controller() {}

Controller.setRouter = function(router_singleton) {
    Controller.router = router = router_singleton;
};
// may not need setmimes
Controller.setMimes = function(mimes_config) {
};
// set the models to
Controller.setModels = function(models) {
    Controller.prototype.models = models;
};

Controller.extend = function(constructor) {
    console.log('extending', constructor.name);
    if ( !constructor.name ) throw NAME_REQUIRED_ERROR();
    controller_proto = controller_proto || new Controller();
    constructor.prototype.__proto__ = controller_proto;
    var constructed = new constructor();
    //constructed.name = constructor.name;

    // configure event listeners on router.
    var controller_name =
        constructor.name.toLowerCase().replace(/controller$/, '');
    router.removeAllListeners('dispatchTo:' + controller_name);
    router.on('dispatchTo:' + controller_name, constructed._do.bind(constructed));

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
    // TODO: do not require dev to call render explicitly.  Try calling
    // render for the view called <controller name>#<action>
    request.handled_by_controller = true;
    var doAction = this[action];
    console.log(this.constructor.name, 'doing', action);
    // TODO: let express handle errors
    if (typeof doAction != 'function') {
        params.error = params.error || new Error('Action Not Available: #'+ action);
        //return this['404'](params, request, response);
        return response.error({code: 404, error: new Error('Action Not Available: #'+ action)});
    }
    doAction.call(this, params, request, response);
    if (!response.headersSent)
        response.render(params.controller.toString() + '/' + params.action.toString(), params);
}

/**
 *  The default handler for a 404 error code
 */
Controller.prototype['404'] = function(params, request, response) {
    //this._render('404');
    console.error('404 error with params', params);
    var error = params['error'] || {};
    var message = error.message || 'Not Found';
    var stack_trace = error.stack || error || '';
    response.setHeader('content-type', 'text/plain');
    response.statusCode = 404;
    response.end(message + '\n\n' + stack_trace);
}
Controller.prototype[404] = Controller.prototype['404'];

/**
 *  The default handler for a 500 error code
 */
// TODO: may ont need inhouse 500 error
Controller.prototype['500'] = function(params, request, response) {
    // Check if the stack has been passed along
    var error = params.error;
    var message = error.message || 'Internal Server Error';
    var stack_trace = error.stack || error.toString() || '';
    console.error('500 error with params', params);

    response.setHeader('content-type', 'text/plain');
    response.statusCode = 500;
    response.end(message + '\n\n' + stack_trace);
}
Controller.prototype[500] = Controller.prototype['500'];

/***** UTILITY FUNCTIONS *****/
// Eventer accessor methods
/*
Controller.prototype.error = function() {
    this.emit('error', arguments);
}
*/
