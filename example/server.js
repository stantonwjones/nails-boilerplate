// What this should look like in the finished product
// global.Nails = something => sets Nails to global scope
// Nails.configure('./config/application.js'); => configure Nails
//		This should build the router and controller from settings in the application.js file
// 
/** OLD LOGIC FOR TESTING
Nails = require('../index.js');
Application = require('./config/application.js');

var http = require('http');
var router = new Nails.Router( Application.ROUTES );
var defineThisLater;

var server = http.createServer( function( req, res) {
	var responseContent = router.route( req.method, req.url );
	res.writeHead( 200, {'Content-Type': 'text/plain'});
	res.end(responseContent);
});

server.listen( 3333 );
*/
// TODO: wrap business logic in a try/catch loop and render 500 page on error by default
// MAy want to abstract this entire file out to a script
require('../index.js');
application = require('./config/application.js');
Nails.configure( application );
Nails.startServer();