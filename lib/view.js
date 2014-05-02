// design this to be instantiated by viewer and used to render pages
// not eventful... maybe a ready event

module.exports = View;
var responder;
var template_root;
var view_proto;
View.set_responder = function(app_responder) {
    responder = app_responder;
}
View.setTemplateRoot = function(template_root) {
}

function View() {}
View.extend = function(constructor) {
    console.log('extending', constructor.name);
    if ( !constructor.name ) throw NAME_REQUIRED_ERROR();
    view_proto = view_proto || new View();
    constructor.prototype.__proto__ = view_proto;
    var constructed = new constructor();

    // configure event listeners on router.
    var view_name = constructor.name.toLowerCase()
                    .replace(/view$/, '');
    responder.removeAllListeners('respondWith:' + view_name);
    responder.on( 'respondWith:' + view_name, constructed._do.bind(constructed) );

    return constructed;
}

View.prototype._do = function(params, response) {
    response.handled_by_view = true;
    this.render.apply(this, arguments);
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
