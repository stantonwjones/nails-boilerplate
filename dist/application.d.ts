import express from 'express';
import expressWs from 'express-ws';
/**
 * Singleton express application.
 */
declare const app: expressWs.Application;
export declare const ExpressRouter: typeof express.Router;
export declare const expressRouter: expressWs.Router;
export declare const expressStatic: import("serve-static").RequestHandlerConstructor<express.Response<any, Record<string, any>>>;
export default app;
