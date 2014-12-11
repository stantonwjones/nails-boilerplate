/**
 * Singleton express application.
 */
var express = require('express');
var app = express();
module.exports = app;

app.Router = express.Router;
app.static = express.static;
