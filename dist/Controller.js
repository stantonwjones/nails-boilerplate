// Global router instance
let router;
let controller_proto; // This will be assigned an instance of Controller
// TODO: refactor error generation
const NAME_REQUIRED_ERROR = () => {
    return new Error('FATAL ERROR::: Named function required for Controller constructor method');
};
const DISABLE_AUTORENDER = new (class DisableAutorender {
});
/**
 * The base controller definition.
 */
class Controller {
    /**
     * Static reference to the router.
     */
    static router;
    /**
     * Static reference to models, assuming key-value pairs.
     */
    static models;
    /**
     * Returns an instance of `DISABLE_AUTORENDER` to prevent automatic rendering.
     * @returns {DisableAutorender} An instance of `DisableAutorender`.
     */
    static get DISABLE_AUTORENDER() {
        return DISABLE_AUTORENDER;
    }
    /**
     * Sets the router singleton for the Controller.
     * @param {Router} router_singleton - The router instance to be used.
     */
    static setRouter(router_singleton) {
        Controller.router = router = router_singleton;
    }
    /**
     * Sets the models object for the Controller prototype.
     * @param {Record<string, any>} models - An object containing key-value pairs of models.
     */
    static setModels(models) {
        Controller.prototype.models = models;
    }
    /** @type {Record<string, any>} */
    models = {};
    /** @type {RouteDefinition[]} */
    routes = [];
    /**
     * Flag indicating if the controller should default to JSON responses.
     *
     * @type {boolean}
     */
    json = false;
    /**
     * Creates an instance of Controller.
     */
    constructor() {
        const controllerName = this._getControllerName();
        router.removeAllListeners('dispatchTo:' + controllerName);
        router.on('dispatchTo:' + controllerName, this._do.bind(this));
    }
    /**
     * Gets the lowercased controller name without the 'Controller' suffix.
     * @returns {string} The formatted controller name.
     */
    _getControllerName() {
        return this.constructor.name.toLowerCase().replace(/controller$/, '');
    }
    /**
     * Initializes local and global routes defined on the Controller subclass.
     */
    _registerControllerRoutes() {
        // `this.json` is not explicitly defined on Controller, but expected on subclasses
        // assuming it's a boolean or undefined
        const defaultToJson = this.json;
        const controllerName = this._getControllerName();
        if (this.routes && this.routes.length) {
            const localizedRoutes = this.routes.map(route => {
                // TODO: throw an error if :controller is present in local routes
                // TODO: also account for other malformed local routes
                const routePrefix = `/${controllerName}/`;
                const modifiedDestination = (route[1][0] == '/')
                    ? route[1]
                    : (route[1].startsWith('./') ? route[1].replace('./', routePrefix) : routePrefix + route[1]);
                const modifiedOptions = { ...route[2] };
                if (!('json' in modifiedOptions))
                    modifiedOptions.json = defaultToJson;
                if (!('action' in modifiedOptions)
                    && typeof modifiedDestination === 'string' && !modifiedDestination.includes(":action")
                    && !Object.values(modifiedOptions).includes('action')) {
                    const destinationParts = modifiedDestination.split("/");
                    modifiedOptions.action = destinationParts[destinationParts.length - 1];
                }
                modifiedOptions.controller = controllerName;
                return [route[0], modifiedDestination, modifiedOptions];
            });
            router.addRoutes(localizedRoutes);
        }
    }
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
    async _do({ action, params, request, response, ws, next }) {
        request.handled_by_controller = true;
        const doAction = this[action]; // Action method on the controller
        console.log(this.constructor.name, 'doing', action);
        // TODO: let express handle errors
        if (!doAction || typeof doAction !== 'function') {
            const error = new Error('Action Not Available: #' + action);
            if (response) {
                response.status(404).send({
                    error: error.message + '\n' + error.stack
                });
                return;
            }
            if (ws) {
                ws.close(1003, "Action Not available: #" + action);
            }
            return;
        }
        if (ws && !response) { // If it's a websocket request and not an http response
            await doAction.call(this, params, ws, request);
            return;
        }
        // Override async with Controller definition.
        // Not using prototypal function objects
        let actionResponse;
        try {
            actionResponse = await doAction.call(this, params, request, response);
        }
        catch (e) {
            // console.error(e);
            return next(e);
            // response.write({error: e.message, stack: e.stack});
            // actionResponse = 500;
        }
        if ((typeof actionResponse) == 'number') {
            response.sendStatus(actionResponse);
            return;
        }
        if (params._json) {
            console.log("Sending JSON");
            console.log("The ACTION RESPONSE", actionResponse);
            response.json(actionResponse || {});
            return;
        }
        //let viewAction = params._action ? params._action.toString() : "index";
        let viewPath = `${this._getControllerName()}/${action}`;
        const renderView = (templateVars) => {
            if (response.headersSent) {
                return;
            }
            if (!!params._json) {
                response.json(templateVars === undefined ? params : templateVars);
                return;
            }
            response.render(viewPath, templateVars === undefined ? params : templateVars, function (err, html) {
                if (err && err.message.match(/Failed to lookup view/)) {
                    response.render(viewPath + ".ejs", params);
                }
                else if (err) {
                    console.error(err);
                    response.sendStatus(400); // Changed from 400, err to just 400
                }
                else {
                    response.send(html);
                }
            });
        };
        if (!response.headersSent
            && !params._async
            && actionResponse !== DISABLE_AUTORENDER) { // TODO: what does this do?
            if (actionResponse instanceof Promise) {
                // TODO: add a timeout so an unresolved promise doesn't preserve the
                // connection indefinitely.
                actionResponse
                    .then(renderView)
                    .catch((error) => {
                    console.error(error);
                    response.sendStatus(500); // Changed from 500, error to just 500
                });
            }
            else {
                renderView(actionResponse);
            }
        }
    }
}
const error_codes = [404, 500];
error_codes.forEach((ec) => {
    Controller.prototype[ec] = function (params, request, response) {
        //this._render('404');
        console.error(ec.toString() + ' error with params', params);
        const error = params['error'] || {};
        const message = error.message || 'Error';
        const stack_trace = error.stack || error || '';
        response.setHeader('content-type', 'text/plain');
        response.statusCode = ec;
        response.end(message + '\n\n' + stack_trace);
    };
    Controller.prototype[ec.toString()] = Controller.prototype[ec];
});
export default Controller;
//# sourceMappingURL=Controller.js.map