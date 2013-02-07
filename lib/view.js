// design this to be instantiated by viewer and used to render pages
// not eventful... maybe a ready event
var appViewer;
module.exports = function(viewer) {
    appViewer = viewer;
    return View;
}

function View(options) {
    appViewer.on('render:'+options.name, self.render);
}
