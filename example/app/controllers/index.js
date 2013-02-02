/**
 *	Manifest file for controllers
 */
 module.exports = function(Nails) {
 	return {
	 	home: require('./home_controller.js')(Nails);
	}
 }
