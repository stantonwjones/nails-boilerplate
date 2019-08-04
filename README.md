# Nails-Boilerplate: A Node Webservice Framework

This framework is designed to provide a lightweight, configurable MVC backend
for node developers.  With minimal dependencies, Nails offers a greater
syntactical familiarity than php alongside the creative freedom of bleeding edge
solutions like Rails and Django.

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

node server
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
module.exports = {
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
var service_config = require('nails-boilerplate').config
```

If the config contains a custom field,

```js
module.exports = {
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
which matches all HTTP request methods.

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
-- Coming soon... For now, take a look at the files in the example config directory --

## Controller

Controllers are defined in app/controllers/. Each controller module should
define a Controller subclass. The name will be used to match routes defined in
config/routes.js for incoming requests. Methods on the controller can be used as
actions, receiving **params**, **request**, and **response** as arguments.

For Example:
``` js
const Controller = requre("nails-boilerplate").Controller
class HomeController extends Controller {
  index(params, request, response) {
    // default action
  }

  signin(params, request, response) {
    // does something then renders a view
  }
}
module.exports = HomeController;

function helperMethod() {
  // does something but does not have access to response
}
```

defines a controller which will match any route to *home#\<action\>*. **index**
and **signin** are actions which can be used to render a response to the client.

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

## Model

Models are programmatic representations of data you wish to persist in a
database. By default, models are subclasses of
[Mongoose Models][mongoose_model_docs], and come with the `save()`, `find()`,
and `where()` methods, to name a few. You can define your own models by
extending an instance of the `Model` class provided by Nails:

``` js
const Model = require("nails-boilerplate").Model;
const userSchema = {name: String, email: String};
module.exports = class User extends new Model("User", {schema: userSchema}) {
  // Define your helper methods here
};
```

The constructor for Model accepts two arguments: the `modelName` and an
`options` object which is passed to the database connector module. The
Mongoose connector accepts a schema field that is used to describe how
documents are stored in MongoDB.

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
Views are basically templates used to render an html response for a browser.
Nails comes prepackaged with React.js serverside templating, and EJS templates.
If no template engine is specified in the service config, Nails will Default to
EJS. Nails will always attempt to autorender your views unless a response has
already been sent to the client.

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
