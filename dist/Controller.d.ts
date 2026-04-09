import { type RouteDefinition, type ControllerDoRouteParams } from './config.ts';
interface Router {
    on(event: string, listener: Function): void;
    removeAllListeners(event: string): void;
    addRoutes(routes: RouteDefinition[]): void;
}
declare const DISABLE_AUTORENDER: {};
declare class Controller {
    static router: Router;
    static models: Record<string, any>;
    static get DISABLE_AUTORENDER(): typeof DISABLE_AUTORENDER;
    static setRouter(router_singleton: Router): void;
    static setModels(models: Record<string, any>): void;
    models: Record<string, any>;
    routes: RouteDefinition[];
    json: boolean;
    constructor();
    _getControllerName(): string;
    /** Initializes local and global routes defined on the Controller subclass */
    _registerControllerRoutes(): void;
    /****  Network Methods  *****/
    /**
     *  The main entry function of the controller.
     *
     *  @param {string} options.action      The action called for this controller
     *  @param {object} options.params      The parameter hash for this action
     *  @param {object} options.request     The http request object from the http server
     *  @param {object} options.response    The http response object from the http server
     *  @param {object} options.ws          The WebSocket instance
     *  @param {object} options.next        The Express NextFunction
     */
    _do({ action, params, request, response, ws, next }: ControllerDoRouteParams): Promise<void>;
}
export default Controller;
