import { EventEmitter } from 'node:events';
import {type WebSocket} from "ws";
import express, {type NextFunction, type Request, type Response} from 'express';
import expressWs, {type Router as WsRouter, type Application as WsApplication, type WebsocketRequestHandler} from 'express-ws';
import app, {expressRouter, ExpressRouter, expressStatic} from './application.ts';
import { type RouteDefinition, type RouteOptions } from './config.ts';

interface ExpressWsType {
    app: any;
    getWss: () => any;
    applyTo: (router: any) => void;
}

class NailsRouter extends EventEmitter {
  private static _webSocketsEnabled: boolean = true;
  private static _expressWs: ExpressWsType;

  static get webSocketsEnabled(): boolean {
    return this._webSocketsEnabled;
  }

  static set webSocketsEnabled(enabled: boolean) {
    this._webSocketsEnabled = enabled;
  }

  static set expressWs(ews: ExpressWsType) {
    this._expressWs = ews;
  }

  static get expressWs(): ExpressWsType {
    return this._expressWs;
  }

  private application: WsApplication = app; // TODO: Type this more specifically if application.js is also converted to TS
  public expressRouter: WsRouter = expressRouter; // express-ws adds a ws method
  public routes: any[]; // TODO: Type this more specifically

  constructor(routes: RouteDefinition[]) { // TODO: Type routes more specifically
    super();
    this.addRoutes(routes);
  }

  addRoutes(routes: RouteDefinition[]): void { // TODO: Type routes more specifically
    this.routes = routes;
    routes.forEach(this.addRoute.bind(this));
  }

  addRoute(route: RouteDefinition): void { // TODO: Type route more specifically
    const method = route[0].toLowerCase();
    const path_matcher = route[1];
    const consequences = route[2];

    console.log("setting route for", method, path_matcher, consequences);

    if (method.match(/ws/i)) {
      this.expressRouter.ws(
        path_matcher,
        this.get_websocket_handler(consequences)
      );
    } else if (consequences && consequences.public) {
      this.expressRouter.use(
        path_matcher,
        expressStatic(this.application.get('public_root'))
      );
    } else {
      this.expressRouter[method](
        path_matcher,
        this.get_express_route_handler(consequences)
      );
    }
  }

  routeWs(ws: WebSocket, request: Request): void { // TODO: Define a proper WebSocket type
    console.log(
      '\nSERVER_LOG:: WebSocket Router received request for: ',
      request.method,
      request.url,
      '\n'
    );

    const params: any = {...request.params, ...request.query};

    const controller: string = params._controller;
    const action: string = params._action;
    console.log('the action is:', controller, action, params);
    console.log('the params are:', params);
    console.log('ws router emitting:', 'dispatchTo:' + controller);
    this.emit('dispatchTo:' + controller, action, params, request, null, ws);

    if (!(request as any).handled_by_controller) {
      params.error = { message: 'controller ' + controller + ' does not exist' };
      console.log('closing websocket');
      return ws.close(1003, "Action Not available: #" + action);
    }
  }

  route(request: Request, response: Response, next: NextFunction): void {
    console.log(
      '\nSERVER_LOG:: Router recieved request for: ',
      request.method,
      request.url,
      '\n'
    );

    const params: any = { ...request.params, ...request.query};

    const controller: string = params._controller;
    const action: string = params._action;
    console.log('the action is:', controller, action, params);
    console.log('the params are:', params);

    console.log('router emitting:', 'dispatchTo:' + controller);
    this.emit('dispatchTo:' + controller, {action, params, request, response, next});

    params.error = { message: 'controller ' + controller + ' does not exist' };
    if (!(request as any).handled_by_controller) {
      this.emit('dispatchTo:application', {action: 404, params, request, response});
    }
  }

  get_websocket_handler(routeOptions: RouteOptions | undefined): WebsocketRequestHandler {
    const route_options = routeOptions || {};
    return (ws: WebSocket, request: express.Request) => { // TODO: Define a proper WebSocket type
      console.log("handling a websocket request");
      let controller = route_options.controller;
      let action = route_options.action;

      for (let i = 0; route_options[i]; i++) {
        if (route_options[i] === 'action') {
          action = action || (request.params as any)[i];
        } else if (route_options[i] === 'controller') {
          controller = controller || (request.params as any)[i];
        } else {
          (request.params as any)[route_options[i]] = (request.params as any)[i];
        }
      }
      (request.params as any)._action = action || (request.params as any).action || "index";
      (request.params as any)._controller =
        controller || (request.params as any).controller || "application";

      this.routeWs(ws, request);
    };
  }

  get_express_route_handler(route_options: RouteOptions | undefined) {
    route_options = route_options || {};
    return async (request: Request, response: Response, next: NextFunction) => {
      let controller: string | undefined = route_options['controller'];
      let action = route_options['action'];
      let json: boolean = !!route_options['json'];
      let path: string | undefined = route_options['path'];
      let async: boolean | undefined = route_options['async'];
      let autorender: boolean | undefined = route_options['disable_autorender'];

      for (let i = 0; route_options[i]; i++) {
        if (route_options[i] === 'action') {
          action = action || (request.params as any)[i];
        } else if (route_options[i] === 'controller') {
          controller = controller || (request.params as any)[i];
        } else if (route_options[i] === 'json') {
          json = json || (request.params as any)[i];
        } else {
          (request.params as any)[route_options[i]] = (request.params as any)[i];
        }
      }

      (request.params as any)._action = action || (request.params as any).action || "index";
      (request.params as any)._controller =
        controller || (request.params as any).controller || "application";
      (request.params as any)._json = json || !!(request.params as any).json;
      (request.params as any)._async = async == null || async == undefined ?
        !!this.application.get('nails_config').config.ASYNC : async;
      (request.params as any)._autorender = autorender ? !!autorender : true;

      this.route(request, response, next);
    };
  }
}

export default NailsRouter;
