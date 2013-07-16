// design this to be instantiated by viewer and used to render pages
// not eventful... maybe a ready event

module.exports = View;
var responder;
View.setResponder = function(app_responder) {
    responder = app_responder;
}

function View(constructor) {
    if ( !contructor.extended_by_nails_controller ) {
        if ( !constructor.name ) throw 'FATAL ERROR::: Named function required for View constructor method';
        constructor.extended_by_nails_controller = true;
        constructor.prototype.__proto__ = new View(constructor);
        return new constructor();
    }

    var view_name = constructor.name.toLowerCase();
    responder.removeAllListeners('respondWith:' + view_name);
    responder.on( 'respondWith:' + view_name, this.render.bind(this) );
}

/**
 * Default render function. TODO: prob want to change this.
 */
View.prototype.render = function(response, params) {
    // TODO: may want to move mime handling to the responder
    response.writeHead('content-type', 'application/json');
    response.write( JSON.stringify(params) );
    response.end();
}
