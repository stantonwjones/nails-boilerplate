var Cookies = require('cookies');
// TODO: SECURITY: look into option for using keygrip to sign cookies in production
module.exports.wrap = function(request, response, keygrip) {
    var cookies = new Cookies( request, response, keygrip );
    request.cookies = response.cookies = cookies;
}
