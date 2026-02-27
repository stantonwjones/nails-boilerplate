import { type MimesConfig } from '@projectinvicta/nails';

const mimes: MimesConfig = {
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
};

export default mimes;
