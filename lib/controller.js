const fs = require('fs');
const events = require('events');
const application = require('./application');

var router;
var controller_proto;
var models;

// TODO: refractor error generation
var NAME_REQUIRED_ERROR = function () {
  return new Error(
      'FATAL ERROR::: Named function required for Controller constructor method');
}

// The base controller definition
class Controller {
  static setRouter (router_singleton) {
    Controller.router = router = router_singleton;
  }

  static setModels (models) {
    Controller.prototype.models = models;
  }

  static extend (constructor) {
    console.log('extending', constructor.name);
    if (!constructor.name) throw NAME_REQUIRED_ERROR();
    controller_proto = controller_proto || new Controller();
    constructor.prototype.__proto__ = controller_proto;
    var constructed = new constructor();

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
  _do (action, params, request, response) {
    // TODO: do not require dev to call render explicitly.  Try calling
    // render for the view called <controller name>#<action>
    request.handled_by_controller = true;
    var doAction = this[action];
    console.log(this.constructor.name, 'doing', action);
    // TODO: let express handle errors
    if (typeof doAction != 'function') {
      //return this['404'](params, request, response);
      error = new Error('Action Not Available: #' + action);
      return response.status(404).send({
        error: error.stack
      });
    }
    // Override async with Controller definition.
    if (doAction.async == true || doAction.async == false)
      params._async = doAction.async;
    doAction.call(this, params, request, response);
    // Default to the jsx engine. If that doesn't work, try the configured view engine.
    if (!response.headersSent && !params._async) try {
      response.render(params._controller.toString() + '/' + params._action.toString() + ".jsx", params);
    } catch (error) {
      response.render(params._controller.toString() + '/' + params._action.toString(), params);
    }
  }
}

const error_codes = [404, 500];
error_codes.forEach((ec) => {
  Controller.prototype[ec] = function (params, request, response) {
    //this._render('404');
    console.error(ec.toString() + ' error with params', params);
    var error = params['error'] || {};
    var message = error.message || 'Error';
    var stack_trace = error.stack || error || '';
    response.setHeader('content-type', 'text/plain');
    response.statusCode = ec;
    response.end(message + '\n\n' + stack_trace);
  };
  Controller.prototype[ec.toString()] = Controller.prototype[ec];

});

module.exports = Controller;
