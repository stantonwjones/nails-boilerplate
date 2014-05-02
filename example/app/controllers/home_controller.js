module.exports = function HomeController() {
    // TODO:
    //  1. add example functions for rendering a view
    //  2. add example functions for rendering json
    this.index = function(params, request, response) {
        response.public({path: 'index.html'});
    };
    this.json = function(params, request, response) {
        response.json({test: 'json'});
    };
}
