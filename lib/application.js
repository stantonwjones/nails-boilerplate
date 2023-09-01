const bodyParser = require('body-parser');

/**
 * Singleton express application.
 */
var express = require('express');
var app = express();
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Parse application/json
app.use(bodyParser.json());
module.exports = app;

app.Router = express.Router;
app.static = express.static;
