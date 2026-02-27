// const bodyParser = require('body-parser');
import pkg from 'body-parser';
const {urlencoded, json} = pkg;
import express from 'express';
import expressWs from 'express-ws';
import cookieParser from 'cookie-parser';

/**
 * Singleton express application.
 */
// var express = require('express');
const {app, applyTo} = expressWs(express());
app.use(cookieParser());
// TODO: this has to be done before routes in order to work. Can consider allowing the config to turn this off
// expressWs(app);
// Parse application/x-www-form-urlencoded
app.use(urlencoded({ limit: '2mb', extended: false }));
// Parse application/json
app.use(json({limit: '2mb'}));

export const ExpressRouter = express.Router;
export const expressRouter = express.Router();
applyTo(expressRouter);
export const expressStatic = express.static;

// export ExpressRouter;
// export expressStatic;

export default app;
