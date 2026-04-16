import { EventEmitter } from 'node:events';
import { type WebSocket } from "ws";
import { type NextFunction, type Request, type Response } from 'express';
import { type Router as WsRouter, type WebsocketRequestHandler } from 'express-ws';
import { type RouteDefinition, type RouteOptions } from './types.js';
interface ExpressWsType {
    app: any;
    getWss: () => any;
    applyTo: (router: any) => void;
}
declare class NailsRouter extends EventEmitter {
    private static _webSocketsEnabled;
    private static _expressWs;
    static get webSocketsEnabled(): boolean;
    static set webSocketsEnabled(enabled: boolean);
    static set expressWs(ews: ExpressWsType);
    static get expressWs(): ExpressWsType;
    private application;
    expressRouter: WsRouter;
    routes: any[];
    constructor(routes: RouteDefinition[]);
    addRoutes(routes: RouteDefinition[]): void;
    addRoute(route: RouteDefinition): void;
    routeWs(ws: WebSocket, request: Request): void;
    route(request: Request, response: Response, next: NextFunction): void;
    get_websocket_handler(routeOptions: RouteOptions | undefined): WebsocketRequestHandler;
    get_express_route_handler(route_options: RouteOptions | undefined): (request: Request, response: Response, next: NextFunction) => Promise<void>;
}
export default NailsRouter;
