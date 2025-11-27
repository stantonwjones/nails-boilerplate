# Nails-Boilerplate: A Node Webservice Framework

This framework is designed to provide a lightweight, configurable MVC backend
for node developers.  With minimal dependencies, Nails offers a greater
syntactical familiarity than php alongside the creative freedom of well developed
server framework solutions like Rails and Django.

This boilerplate offers the basic necessities to get your MVC site off the ground.
The modules used in Nails Boilerplate can be easily extended to produce the custom
functionality to fit your needs, and you are encouraged to do so.

## Install

```
sudo npm install -g nails-boilerplate

nails init <app_name>
```

This will initialize a barebones app in the directory of the same name.  Take a
look at the self-documented config files and example controller and view before
getting started.  Additional controllers and views will automatically be imported
into nails.  Now just hook the new controllers in with some new routes and you're
off to a good start.

```
cd app_name

npm install

npm start
```

## Getting to know your Nails service

For your convenience, here is a quick outline of the main components of a nails service.
Remember: each object comes with an example file to use for reference when building your service.

### Config
Your configuration files are stored in app_name/config/. There are three default config files:

```
service.js
routes.js
db.js
```

Each default config file is annotated with comments documenting each field to
help you tailor your service to your needs.

#### service.js
service.js contains information necessary to run your server. By default, it
specifies the port and the location of important libraries. To override these
values in different runtime environments, add a child object.
```js
export default {
  ...
  PORT: 3000,
  PROD: {
    PORT: 80
  }
}
```

Nails checks the NODE_ENV environment variable. If a matching child config
object is present, then those values will override the parent config. In the
above example, PORT will be overridden to 80 if NODE_ENV is set to PROD.

While most of these values don't need to be changed, feel free to add custom
fields. The resulting config will be available to your service through the nails
module:

```js
import nails from 'nails-boilerplate';

const service_config = nails.config
```

If the config contains a custom field,

```js
export default {
  ...
  PORT: 3000,
  yourCustomField: 'yourCustomValue'
}
```

then `service_config.yourCustomField` as defined above will be equal to
`'yourCustomValue'`.

#### routes.js
*routes.js* is a list defining mappings from a url path to a *Controller* and
*Action*. Each entry in the list is an array with three elements:
`[method, path, options]`

**method** is a string defining the HTTP request method of the route. Supported
methods are *GET*, *PUT*, *POST*, *DELETE*, and *ALL*. All is a special case
which matches all HTTP request methods. Lastly, *WS* routes will handle WebSocket connections.

**path** is a string or regular expression which matches the path of the
incoming request. If *path* is a string, then the request must match exactly*.
You can use route parameters to dynamically match parts of the path and assign
them to the *params* object. For example, if you define a route with the path:
`'/users/:userId'`
and your service receives a request with the path:
`'/users/777'`
then *userId* will be set in the params object:
```js
{ userId: 777 }
```

You can define *:controller* and *:action* as route parameters as well. Not only
will those values be set in the params object, but the request will be routed
to the matching controller and action. See
[express routes][express_routing_docs] for more information on how route
parameters work.

\*requests for static assets will only match the prefix of the path.

**options** is a JSON object which modifies how the request will be routed:
* *controller* a String indicating the controller to route to.
* *action* a String indicating the action to route to.
* *json* a boolean indicating whether to render a JSON response rather than an
  HTML response. If true, nails will not attempt to render a view for this
  route. Instead, your service will respond with JSON for this route.
* *public* a boolean indicating whether this route is for static assets. If
  true, the router will only attempt to match the prefix of the request path.
  The child portion of the path will be forwarded to the *public/* folder in
  your service directory. For route:
  `['GET', '/public_url_path', {public: true}]`
  if your service receives a request to:
  `/public_url_path/js/index.js`
  then the response will be the file:
  `your_service_root_path/public/js/index.js`
* *0, 1, 2...* a string which gives regex captures named keys in the params
  object. This will give your regex captures more meaningful named keys rather
  than indices. You can name your regex captures "controller" and/or "action"
  to dynamically route your request to the appropriate handler.

#### db.js

Quickly configure your database connection here. Nails comes pre-configured to
use the sequelize connector, giving your models sequelize support. The initial setup
uses a *sqlite3* database file `config/development.db` and an in-memory database in the test environment. Change the address to change the location and
version of your desired sql database. Check out [Sequelize](https://sequelize.org)
for more info.

Alternatively, you can configure a connection to MongoDB using the mongoose_connector.js.
If enabled, models will accept [Mongoose](https://mongoosejs.com/docs/) schemas and will
be backed by the desired MongoDB. Consider using the in-memory DB during development.

## Controller

Controllers are defined in app/controllers/. Each controller module should
define a Controller subclass. The name will be used to match routes defined in
config/routes.js for incoming requests. Methods on the controller can be used as
actions, receiving **params**, **request**, and **response** as arguments.

For Example:
``` js
// const Controller = requre("nails-boilerplate").Controller
import nails from 'nails-boilerplate';

class HomeController extends nails.Controller {
  index(params, request, response) {
    // default action
  }

  signin(params, request, response) {
    // does something then renders a view
  }
}
export default HomeController;

function helperMethod() {
  // does something but does not have access to response
}
```

defines a controller which will match any route to *home#\<action\>*. **index**
and **signin** are actions which can be used to render a response to the client.

### Local Routes

You can define a local routing table directly in the controller.
Local routes take precidence over global routes. All local routes
are prefixed with the controller name unless they start with '/'.
For example, in HomeController the following route:

`["get", "data", {action: 'getData', json: true}],`

will accept GET requests to /home/data and respond with the json
object returned by the getData function. If the route is changed to:

`["get", "/data", {action: 'getData', json: true}],`

it will accept GET requests to /data instead. All local routes are
implicitly routed to their respective parent controllers.

```js
export default class UsersController extends nails.Controller {
  routes = [
    // Routes requests to /absolute/path
    ['get', '/absolute/path', {action: 'actionA'}],
    // Routes requests to /users/relative/path
    ['get', './relative/path', {action: 'actionB'}],
    // Routes requests to /users/relative/path
    ['get', 'relative/path', {action: 'actionB'}],
    // If no action is provided, the last path segment
    // is used as the action name.
    ['get', 'actionC']
  ]

  // Handles requests to /absolute/path
  actionA(request, response, params) {}

  // Handles requests to /users/relative/path
  actionB(request, response, params) {}

  // Handles requests to /users/actionC
  actionC(request, response, params) {}
}
```

### Actions
Actions are used to define how nails should respond to an incoming request.
If no action has been defined for a route, nails will default to the index
action.*

For example, HomeController#index will attempt to render the view defined in
//app/views/home/index.jsx

The view each action searches for will always follow the pattern:
//app/views/*\[controller name\]*/*\[action name\]*.jsx

The file extension may differ based on which template engine you configure.

Depending on the return value, Nails will pass a different set of parameters to
the view engine:
* **undefined** If there is no return statement in the action, Nails will pass
  the *params* obect to the rendering engine.
* **Object** If a generic object is returned, Nails will attempt to autorender
  the view immediately using the returned object instead of *params*.**
* **Promise** If a promise is returned, Nails will wait to autorender the view
  until the *Promise* resolves. If it resolves with no return value, the view
  is rendered using *params*. Otherwise, the view is rendered using the
  resolved value of the *Promise*\**

\*If a response has already been sent to the client, autorender will be skipped.
\*\*For JSON routes, the returned object will be rendered as stringified JSON.

#### Params
Params is a generic JSON object which represents the request details. Usually,
Params will correspond to the query portion of your request.

For example, a GET request to *//some/path?item0=a&item1=b* will generate the
params object:
``` js
{
  item0: "a",
  item1: "b"
}
```

#### Request
An [express Request object][express_request_docs].

#### Response
The response object provided by *express.js*. The *#render()* method has been
overridden to allow for the rendering of views by name.

#### JSON Actions
JSON actions only return JSON objects in the response instead of text or HTML. These actions are ideal for building an API Server. There are three ways to designate JSON Actions:

##### Express  Response Object
  ```js
  response.json({your: 'jsonresponse'})
  ```
  Simply use the express Response object directly

##### JSON Routes
You can configure an individual route to respond with JSON by setting the `json` option to `true`.
```js
['get', '/your/json/route', {json: true}],
```

##### API Controllers
By setting `json` to `true`, all actions in a controller will respond with JSON.

```js
class YourApiController extends nails.Controller {
  json = true;
  
  action(params, request, response) {
    return {your: 'jsonresponse'};
  }
}
```

## Model

Models are programmatic representations of data you wish to persist in a
database. The constructor for Model accepts two arguments: the `modelName` and an
`options` object which is passed to the database connector module.

### Sequelize Models

Sequelize models are subclasses of
[Sequelize Models][sequelize_model_docs], and come with the `count()`, `findAll()`,
and `create()` methods, to name a few. You can define your own models by
extending an instance of the `Model` class provided by Nails:

```js
// const Model = require("nails-boilerplate").Model;
import nails from 'nails-boilerplate';
import {DataTypes} from 'sequelize';
schema = {
  name: {type: DataTypes.STRING, allowNull: false},
  email: {type: DataTypes.STRING, allowNull: false}
};

options = {
  indexes: [
    {
      unique: true,
      fields: ['email'],
    },
  ],
};

export default class User extends new Model("User", {schema, options}) {
  someHelperMethod() {
    // This method will be available on all instances of User and is
    // an ideal way to simplify data manipulation.
  }
};

```

### Mongoose Models
Mongoose models are subclasses of
[Mongoose Models][mongoose_model_docs], and come with the `save()`, `find()`,
and `where()` methods, to name a few. You can define your own models by
extending an instance of the `Model` class provided by Nails:

``` js
// const Model = require("nails-boilerplate").Model;
import nails from 'nails-boilerplate';
const userSchema = {name: String, email: String};
export default class User extends new Model("User", {schema: userSchema}) {
  // Define your helper methods here
};
```

The `schema` option for Mongoose Models accepts a schema field that is used
to define how documents are stored in MongoDB.

### Model Library
Nails will store all instantialized models in a single object called `MODELS`. By accessing these models via the library, you can avoid circular dependencies and ensure all models have been fully initialized.

```js
class User extends nails.Model("User", {schema, options}) {
  // A helper method which depends on anoher model using the
  // Nails Model Library rather than directly importing the model.
  async findFriends() {
    return nails.MODELS.Friend.findByUserId(this.id);
  }
}
```
This design pattern is not always necessary, but will help avoid circular dependencies.

### Database Connectors

Database connectors are intermediaries which define how a Model interacts with
a database. Database connector modules need to export two methods:
* _connect(db_config)_ uses the db config defined in *db.js* to connect to
  a database. This function will be called once by Nails.
* _generateModelSuperclass(name, options)_ uses the provided Model name and
  options to generate a Model prototype for use as an interface. A Model
  interface is generated for each of your models, allowing them to interact with
  a database. Ideally, interfaces will define save() and find() methods, but
  these methods and their implementations are up to the individual connector.

## View
Views are dynamic templates used to render an html response for a browser.
Nails comes prepackaged with EJS templates.
If no template engine is specified in the service config, Nails will default to
EJS. Nails will always attempt to autorender your views unless a response has
already been sent to the client.

### React Frontend with Vite

This project uses Vite to build the frontend React application. The source files for the React app are located in the `src` directory. The server is pre-configured to serve the built React application.

To rebuild the frontend application, you can run the following command:

```bash
npm run build
```

## Testing

This project uses [Vitest](https://vitest.dev/) for running tests. All test files are located in the `spec` folder. To run the tests, use the following command:

```bash
npm test
```

For more information on how to write tests with Vitest, please refer to the [official documentation](https://vitest.dev/guide/).

Stay tuned as nails evolves:

* Server/client redirects
* Custom Request middleware
* Fancy Logging
* Sessions
* Server security

Enjoy! Feature requests, bug reports, and comments are welcome on github.

[express_routing_docs]: https://expressjs.com/en/guide/routing.html
[express_request_docs]: https://expressjs.com/en/5x/api.html#req
[mongoose_model_docs]: https://mongoosejs.com/docs/api/model.html
[sequelize_model_docs]: https://sequelize.org/docs/v6/core-concepts/model-basics/
