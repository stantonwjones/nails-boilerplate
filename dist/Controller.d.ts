import { type RouteDefinition, type ControllerDoRouteParams } from './types.js';
interface Router {
    on(event: string, listener: Function): void;
    removeAllListeners(event: string): void;
    addRoutes(routes: RouteDefinition[]): void;
}
declare const DISABLE_AUTORENDER: {};
/**
 * The base controller definition.
 */
declare class Controller {
    /**
     * Static reference to the router.
     */
    static router: Router;
    /**
     * Static reference to models, assuming key-value pairs.
     */
    static models: Record<string, any>;
    /**
     * Returns an instance of `DISABLE_AUTORENDER` to prevent automatic rendering.
     * @returns {DisableAutorender} An instance of `DisableAutorender`.
     */
    static get DISABLE_AUTORENDER(): typeof DISABLE_AUTORENDER;
    /**
     * Sets the router singleton for the Controller.
     * @param {Router} router_singleton - The router instance to be used.
     */
    static setRouter(router_singleton: Router): void;
    /**
     * Sets the models object for the Controller prototype.
     * @param {Record<string, any>} models - An object containing key-value pairs of models.
     */
    static setModels(models: Record<string, any>): void;
    /** @type {Record<string, any>} */
    models: Record<string, any>;
    /** @type {RouteDefinition[]} */
    routes: RouteDefinition[];
    /**
     * Flag indicating if the controller should default to JSON responses.
     *
     * @type {boolean}
     */
    json: boolean;
    /**
     * Creates an instance of Controller.
     */
    constructor();
    /**
     * Gets the lowercased controller name without the 'Controller' suffix.
     * @returns {string} The formatted controller name.
     */
    _getControllerName(): string;
    /**
     * Initializes local and global routes defined on the Controller subclass.
     */
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
