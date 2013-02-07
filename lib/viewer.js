var EventEmitter = require('events').EventEmitter;
// design this to init all views and templates.
// listens to all controllers for render events.
// Analogous to a router for views
function Viewer() {
    var self = this;
    self._render = function(viewName, viewData, request, response) {
        self.emit('render:'+viewName, viewData, request, response);
    }

}

Viewer.prototype = new EventEmitter();
