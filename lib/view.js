// design this to be instantiated by viewer and used to render pages
// not eventful... maybe a ready event

module.exports = View;
var responder;
var template_root;
View.set_responder = function(app_responder) {
    responder = app_responder;
}
View.setTemplateRoot = function(template_root) {
}

function View(constructor) {
    /*
    if ( !constructor.extended_by_nails_view ) {
        if ( !constructor.name ) throw 'FATAL ERROR::: Named function required for View constructor method';
        constructor.extended_by_nails_view = true;
        constructor.prototype.__proto__ = new View(constructor);
        return new constructor();
    }

    var view_name = constructor.name.toLowerCase();
    responder.removeAllListeners('respondWith:' + view_name);
    responder.on( 'respondWith:' + view_name, this.render.bind(this) );
    */
    if ( !constructor.name ) throw 'FATAL ERROR::: Named function required for View constructor method';
    constructor.prototype.__proto__ = View.prototype;
    var view_name = constructor.name.toLowerCase();
    var constructed = new constructor();
    responder.removeAllListeners('respondWith:' + view_name);
    responder.on('respondWith:'+view_name, constructed.render.bind(constructed));
    return constructed;
}

/**
 * Default render function. TODO: prob want to change this.
 * TODO: wrap this in a _do block to catch errors
 */
View.prototype.render = function(params, response) {
    // TODO: may want to move mime handling to the responder
    response.statusCode = 200;
    response.setHeader('content-type', 'application/json');
    response.end( JSON.stringify(params) );
}

// TODO implement this
View.prototype.getTemplate = function(){};
