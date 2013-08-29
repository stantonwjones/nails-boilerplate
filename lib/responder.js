/**
 * Manages outgoing responses.
 * The responder is analogous to the router, but for outgoing reponses
 * to the client.  It is passed to each view in order to link the
 * controllers to the views they are responding with.
 */

// TODO: use mimes library
var EventEmitter = require('events').EventEmitter;
var path = require('path');

module.exports = Responder;
function Responder( mimes ) {
    this.mimes = mimes;
}

Responder.prototype.__proto__ = new EventEmitter();

Responder.prototype.wrap_response = function( http_response ) {
    http_response.render = this.render.bind(this, http_response);
    http_response.public = this.public.bind(this, http_response);
    //if (http_response.error) console.log('response.error already exists');
    http_response.error = this.error.bind(this, http_response);
}

Responder.prototype.render = function( response, view_name, params ) {
    response.setHeader('content-type', 'text/html');
    this.emit('respondWith:' + view_name, params, response);
    if (!response.handled_by_view)
        this.emit('respondWith:jsonview', params, response);
}
Responder.prototype.public = function( response, params ) {
    var mimes = this.mimes;
    var filepath = params.path;
    // may want to move mime type handling to the view
    var ext = path.extname(filepath).substr(1);
    if (!ext) ext = 'html';
    var contype = mimes[ext] ? mimes[ext].contentType : 'text/plain';
    response.setHeader('content-type', contype);
    this.emit('respondWith:publicview', params, response);
}
Responder.prototype.error = function( response, params ) {
    this.emit('respondWith:errorview', params, response);
}
