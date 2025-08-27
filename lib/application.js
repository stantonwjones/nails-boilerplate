// const bodyParser = require('body-parser');
import pkg from 'body-parser';
const {urlencoded, json} = pkg;
import express from 'express';
import expressWs from 'express-ws';

/**
 * Singleton express application.
 */
// var express = require('express');
var app = express();
// TODO: this has to be done before routes in order to work. Can consider allowing the config to turn this off
// expressWs(app);
// Parse application/x-www-form-urlencoded
app.use(urlencoded({ limit: '2mb', extended: false }));
// Parse application/json
app.use(json({limit: '2mb'}));

app.Router = express.Router;
app.static = express.static;

export default app;
