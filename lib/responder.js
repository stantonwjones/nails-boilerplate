/**
 * Manages outgoing responses.
 * The responder is analogous to the router, but for outgoing reponses
 * to the client.  It is passed to each view in order to link the
 * controllers to the views they are responding with.
 */

// TODO: use mimes library
// TODO: this should be a singleton(?)
var EventEmitter = require('events').EventEmitter;
var path = require('path');

module.exports = Responder;
function Responder( mimes ) {
    this.mimes = mimes;
}

Responder.prototype.__proto__ = new EventEmitter();

Responder.prototype.wrap_response = function( http_response ) {
    //http_response.render = this.render.bind(this, http_response);
    //http_response.public = this.public.bind(this, http_response);
    //http_response.json = this.json.bind(this, http_response);
    //if (http_response.error) console.log('response.error already exists');
    http_response.error = this.error.bind(this, http_response);
}

// TODO: perhapse use caller here to get rails-like view
// TODO: check if response.headersSent() to see if user has already rendered a view/json
Responder.prototype.respondWith = function( response, locals ) {
}

Responder.prototype.render = function( response, view_name, params ) {
    // TODO: if no view name, assume json (if typeof viewname != object)
    response.setHeader('content-type', 'text/html');
    this.emit('respondWith:' + view_name, params, response);
    if (!response.handled_by_view)
        this.emit('respondWith:json', params, response);
};
// Is there any reason why this hasn't been implemented yet?
Responder.prototype.json = function( response, params ) {
    response.setHeader('content-type', 'application/json');
    this.emit('respondWith:json', params, response);
};
Responder.prototype.public = function( response, params ) {
    var mimes = this.mimes;
    var filepath = params.path;
    // may want to move mime type handling to the view
    var ext = path.extname(filepath).substr(1);
    if (!ext) ext = 'html';
    var contype = mimes[ext] ? mimes[ext].contentType : 'text/plain';
    response.setHeader('content-type', contype);
    this.emit('respondWith:public', params, response);
};
Responder.prototype.error = function( response, params ) {
    this.emit('respondWith:error', params, response);
};
