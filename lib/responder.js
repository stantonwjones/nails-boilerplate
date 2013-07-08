/**
 * Manages outgoing responses.
 * The responder is analogous to the router, but for outgoing reponses
 * to the client.  It is passed to each view in order to link the
 * controllers to the views they are responding with.
 */
var EventEmitter = require('events').EventEmitter;

function Responder( mimes ) {
}

Responder.prototype.__proto__ = new EventEmitter();

Responder.prototype.wrap_response = function( http_response ) {
    http_response.render = this.render.bind(this, http_response);
}

Responder.prototype.render = function( response, view_name, params ) {
    this.emit('respondWith:' + view_name, response, params);
}
