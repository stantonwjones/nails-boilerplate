import { EventEmitter } from 'node:events';
import app, { expressRouter, expressStatic } from './application.js';
class NailsRouter extends EventEmitter {
    static _webSocketsEnabled = true;
    static _expressWs;
    static get webSocketsEnabled() {
        return this._webSocketsEnabled;
    }
    static set webSocketsEnabled(enabled) {
        this._webSocketsEnabled = enabled;
    }
    static set expressWs(ews) {
        this._expressWs = ews;
    }
    static get expressWs() {
        return this._expressWs;
    }
    application = app; // TODO: Type this more specifically if application.js is also converted to TS
    expressRouter = expressRouter; // express-ws adds a ws method
    routes; // TODO: Type this more specifically
    constructor(routes) {
        super();
        this.addRoutes(routes);
    }
    addRoutes(routes) {
        this.routes = routes;
        routes.forEach(this.addRoute.bind(this));
    }
    addRoute(route) {
        const method = route[0].toLowerCase();
        const path_matcher = route[1];
        const consequences = route[2];
        console.log("setting route for", method, path_matcher, consequences);
        if (method.match(/ws/i)) {
            this.expressRouter.ws(path_matcher, this.get_websocket_handler(consequences));
        }
        else if (consequences && consequences.public) {
            this.expressRouter.use(path_matcher, expressStatic(this.application.get('public_root')));
        }
        else {
            this.expressRouter[method](path_matcher, this.get_express_route_handler(consequences));
        }
    }
    routeWs(ws, request) {
        console.log('\nSERVER_LOG:: WebSocket Router received request for: ', request.method, request.url, '\n');
        const params = { ...request.params, ...request.query };
        const controller = params._controller;
        const action = params._action;
        console.log('the action is:', controller, action, params);
        console.log('the params are:', params);
        console.log('ws router emitting:', 'dispatchTo:' + controller);
        this.emit('dispatchTo:' + controller, { action, params, request, ws });
        if (!request.handled_by_controller) {
            params.error = { message: 'controller ' + controller + ' does not exist' };
            console.log('closing websocket');
            return ws.close(1003, "Action Not available: #" + action);
        }
    }
    route(request, response, next) {
        console.log('\nSERVER_LOG:: Router recieved request for: ', request.method, request.url, '\n');
        const params = { ...request.params, ...request.query };
        const controller = params._controller;
        const action = params._action;
        console.log('the action is:', controller, action, params);
        console.log('the params are:', params);
        console.log('router emitting:', 'dispatchTo:' + controller);
        this.emit('dispatchTo:' + controller, { action, params, request, response, next });
        params.error = { message: 'controller ' + controller + ' does not exist' };
        if (!request.handled_by_controller) {
            this.emit('dispatchTo:application', { action: 404, params, request, response });
        }
    }
    get_websocket_handler(routeOptions) {
        const route_options = routeOptions || {};
        return (ws, request) => {
            console.log("handling a websocket request");
            let controller = route_options.controller;
            let action = route_options.action;
            for (let i = 0; route_options[i]; i++) {
                if (route_options[i] === 'action') {
                    action = action || request.params[i];
                }
                else if (route_options[i] === 'controller') {
                    controller = controller || request.params[i];
                }
                else {
                    request.params[route_options[i]] = request.params[i];
                }
            }
            request.params._action = action || request.params.action || "index";
            request.params._controller =
                controller || request.params.controller || "application";
            this.routeWs(ws, request);
        };
    }
    get_express_route_handler(route_options) {
        route_options = route_options || {};
        return async (request, response, next) => {
            let controller = route_options['controller'];
            let action = route_options['action'];
            let json = !!route_options['json'];
            let path = route_options['path'];
            let async = route_options['async'];
            let autorender = route_options['disable_autorender'];
            for (let i = 0; route_options[i]; i++) {
                if (route_options[i] === 'action') {
                    action = action || request.params[i];
                }
                else if (route_options[i] === 'controller') {
                    controller = controller || request.params[i];
                }
                else if (route_options[i] === 'json') {
                    json = json || request.params[i];
                }
                else {
                    request.params[route_options[i]] = request.params[i];
                }
            }
            request.params._action = action || request.params.action || "index";
            request.params._controller =
                controller || request.params.controller || "application";
            request.params._json = json || !!request.params.json;
            request.params._async = async == null || async == undefined ?
                !!this.application.get('nails_config').config.ASYNC : async;
            request.params._autorender = autorender ? !!autorender : true;
            this.route(request, response, next);
        };
    }
}
export default NailsRouter;
//# sourceMappingURL=Router.js.map