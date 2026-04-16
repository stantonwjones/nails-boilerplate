import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import { Model, Sequelize } from 'sequelize';
import expressApp from './application.js';
import Router from './Router.js';
import Controller from './Controller.js';
export default class Nails {
    static Controller = Controller;
    static instance;
    static get sequelize() {
        return this.instance.sequelize;
    }
    static get initialized() {
        return this.instance.initialized;
    }
    static get config() {
        return this.instance.config;
    }
    static get application() {
        return this.instance.application;
    }
    static get httpServer() {
        return this.instance.httpServer;
    }
    static get httpsServer() {
        return this.instance.httpsServer;
    }
    modelFinalizations = [];
    modelMigrations = [];
    constructor(appConfig) {
        Nails.instance = this;
        this.config = appConfig;
        this.application = expressApp;
        this.Models = {};
        this.Controller = Controller;
        this.sequelize = this.config.db.options
            ? new Sequelize(this.config.db.address, this.config.db.options)
            : new Sequelize(this.config.db.address);
        this.router = new Router([]);
        this.initialized = this.configure();
    }
    async configure() {
        expressApp.set('nails_config', { config: this.config });
        expressApp.set('view engine', 'ejs');
        expressApp.set('views', this.config.service.VIEWS_ROOT);
        expressApp.set("public_root", this.config.service.PUBLIC_ROOT);
        console.log("Initializing Router...");
        // this.router = new Router( app_config.routes || [] );
        console.log("Application Router initialized");
        // init models
        try {
            await this.sequelize.authenticate();
            console.log('Connection has been established successfully.');
        }
        catch (error) {
            console.error('Unable to connect to the database:', error);
        }
        await this.initializeModels();
        Controller.setRouter(this.router);
        await this.initializeControllers();
        this.router.addRoutes(this.config.routes);
    }
    async initializeModels() {
        await this.loadModels(this.config.service.MODELS_ROOT);
        await Promise.all(this.modelFinalizations.map((finalization) => finalization()));
        // TODO: Implement a migration strategy
        await this.sequelize.sync({ alter: { drop: false } });
    }
    async startServer() {
        await this.initialized;
        console.log("CONFIGURATION COMPLETE");
        // TODO: Use logging middleware.
        // Use the router middleware.
        expressApp.use(this.router.expressRouter);
        var host = this.config.service.HOST || 'localhost';
        var port = this.config.service.PORT || 3000;
        let startHttp = 'ENABLE_HTTP' in this.config.service && !!this.config.service.ENABLE_HTTP;
        let startHttps = !!this.config.service.ENABLE_HTTPS;
        if (!startHttp && !startHttps) {
            console.error("Either ENABLE_HTTPS or ENABLE_HTTP must be set for nails to start");
        }
        let atLeastOneServerStarted = false;
        return new Promise((resolve, reject) => {
            if (atLeastOneServerStarted)
                return resolve();
            let serverStartedCallback = () => {
                console.log("Started");
                atLeastOneServerStarted = true;
                resolve();
            };
            if (startHttp) {
                console.log("starting nails HTTP server. listening to ", host + ':' + port);
                if (this.httpServer) {
                    console.warn("Attempted to recreate http server");
                }
                else {
                    this.httpServer = expressApp.listen(port, host, serverStartedCallback);
                    console.log("Done starting HTTP server");
                }
            }
            if (startHttps) {
                if (this.httpsServer) {
                    console.warn("Attempted to recreate HTTPS server");
                }
                else {
                    console.log(`starting nails HTTPS server. Listening to ${host}:${this.config.service.SSL_PORT}`);
                    this.httpsServer = https.createServer({
                        key: this.config.service.PRIVATE_KEY,
                        cert: this.config.service.CERTIFICATE
                    }, expressApp).listen(this.config.service.SSL_PORT, serverStartedCallback);
                }
            }
            // TODO: Set a startup timeout and reject the promise so it does not hang forever;
        });
    }
    async loadModels(absolutePath) {
        if (!fs.existsSync(absolutePath))
            return console.log('Cannot initialize. Path not found.', absolutePath);
        if (!fs.statSync(absolutePath).isFile()) {
            const directory_contents = fs.readdirSync(absolutePath);
            for (const rel_path of directory_contents) {
                await this.loadModels(path.join(absolutePath, rel_path));
            }
            ;
            return;
        }
        console.log('attempting to import Model:', absolutePath);
        // We just need to import each model once so the generateSuperclass
        // method is called at least once for each model.
        const modelModule = await import(absolutePath);
        // TODO: make sure the name isn't constantly "model"
        const modelClass = modelModule.default;
        if (!(modelClass.prototype instanceof Model)) {
            const errorMessage = `Default export is not a sequelize Model: ${absolutePath}`;
            console.error(errorMessage);
            throw errorMessage;
        }
        this.Models[modelClass.name] = modelClass;
        const schema = modelModule.schema;
        const options = modelModule.options;
        const defer = modelModule.defer;
        const afterInitialize = modelModule.afterInitialize;
        if (modelModule.finalize) {
            this.modelFinalizations.push(modelModule.finalize);
        }
        if (modelModule.afterInitializeAll) {
            this.modelFinalizations.push(modelModule.afterInitializeAll);
        }
        this.modelMigrations.push(modelModule.migrate);
        modelClass.init(schema, { sequelize: this.sequelize, ...options });
        if (modelClass && modelClass.name) {
            console.log('imported model:', modelClass.name);
            if (defer) {
                await defer();
            }
            if (afterInitialize) {
                await afterInitialize();
            }
            await modelClass.sync();
        }
        else
            console.warn("No model found at:", absolutePath);
    }
    async initializeControllers(directory) {
        if (!directory)
            directory = this.config.service.CONTROLLERS_ROOT;
        console.log('attempting to import:', directory);
        if (!fs.existsSync(directory))
            return console.error('Cannot initialize. Path not found.', directory);
        if (fs.statSync(directory).isFile()) {
            let subclass = (await import(directory)).default;
            if (!(Controller.isPrototypeOf(subclass)))
                return console.error(`Non-Controller export "${subclass.name}: ${typeof subclass}" found: ${directory}`);
            const controller = new subclass();
            controller._registerControllerRoutes();
            return controller;
        }
        for (const rel_path of fs.readdirSync(directory)) {
            await this.initializeControllers(path.join(directory, rel_path));
        }
    }
}
// const sequelize = new Sequelize();
//# sourceMappingURL=Nails.js.map