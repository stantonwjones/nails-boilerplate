/**
 *  This file uses file extensions in the request to determine
 *  the type of an asset and, therefore, where it can be found
 *  in the file system.
 *
 *  Currently, the supported types are: 'js', 'css', 'html',
 *  'img'
 *  TODO: Add supported types pdf ( or document ), and video
 *  TODO: move this file into nails.  Too annoying for the dev
 *  to see and they shouldn't need to have to change it
 */
 /*
    var mimes = {
    // <ext>: '<type>'
        js: 'js',
        jpg: 'image',
        css: 'css',
        html: 'html'
    };
    */

var mimes = {
    html: {
        type: 'page',
        contentType: 'text/html'
    },
    js: {
        type: 'script', // the type of the script,
        contentType: 'application/javascript' // Header info
    },
    css: {
        type: 'style',
        contentType: 'text/css'
    },
    ico: {
        type: 'image',
        contentType: 'image/x-icon'
    },
    jpg: {
        type: 'image',
        contentType: 'image/jpeg'
    },
    png: {
        type: 'image',
        contentType: 'image/png'
    },
    pdf: {
        type: 'document',
        contentType: 'application/pdf'
    },
    xml: {
        type: 'data',
        contentType: 'text/xml'
    },
    json: {
        type: 'data',
        contentType: 'application/json'
    }
}

module.exports = mimes;
