/**
 * 	This file uses file extensions in the request to determine
 * 	the type of an asset and, therefore, where it can be found
 *	in the file system.
 *
 *	Currently, the supported types are: 'js', 'css', 'html',
 *	'img'
 * 	TODO: Add supported types pdf ( or document ), and video
 *	TODO: move this file into nails.  Too annoying for the dev
 *	to see and they shouldn't need to have to change it
 */
	var mimes = {
	// <ext>: '<type>'
		js: 'js',
		jpg: 'image',
		css: 'css',
		html: 'html'
	};

 /** PROSPECTIVE: hold more data in these objects to save lines
  * f/e:
  var types = {
	js: {
		type: 'js', // TODO: Maybe change js to script?
		contentType: 'application/javascript' // b/c FUCK IE 7 :)
	},
	css: {
	
	}
  }
*/

 exports.mimes = mimes;