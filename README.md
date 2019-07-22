# Nails-Boilerplate: A Node Webservice Framework

This framework is designed to provide a lightweight, configurable MVC backend
for node developers.  With minimal dependencies, Nails offers a greater
syntactical familiarity than php alongside the creative freedom of bleeding edge
solutions like Rails and Django.

This boilerplate offers the basic necessities to get your MVC site off the ground.
The modules used in Nails Boilerplate can be easily extended to produce the custom
functionality to fit your needs, and you are encouraged to do so.

### Install

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

### Getting to know your Nails service

For your convenience, here is a quick outline of the main components of a nails service.
Remember: each object comes with an example file to use for reference when building your service.

#### Config
Your configuration files are stored in app_name/config/. There are three default config files:

```
service.js
routes.js
db.js
```

Each default config file is annotated with comments documenting each field to
help you tailor your service to your needs.

##### service.js
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

##### routes.js
-- Coming soon... For now, take a look at the files in the example config directory --

##### db.js
-- Coming soon... For now, take a look at the files in the example config directory --

#### Controller

Controllers are defined in app/controllers/. Each controller module should
define a Controller subclass. The name will be used to match routes defined in
config/routes.js for incoming requests. Methods on the controller can be used as
actions, receiving <params>, <request>, and <response> as arguments.

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

defines a controller which will match any route to 'home#<action>'. "index" and
"signin" are actions which can be used to render a response to the client.

<DEPRECATED>
Alternatively, you can use named constructor methods:
``` js
module.exports = function HomeController() {
    this.index = function(params, request, response) {
        // default action
    };
    this.signin = function(params, request, response) {
        // does something then renders a view
    };
    this.helper_method = function() {
        // does something but does not have access to response
    };
}
```

###### Actions
Actions are used to define how nails should respond to an incoming request.
By default, actions are synchronous. This means that each action will attempt to
render a corresponding view immediately after the action returns.

For example, HomeController#index will attempt to render the view defined in
//app/views/home/index.jsx

The view each action searches for will always follow the pattern:
//app/views/[controller name]/[action name].jsx

The file extension may differ based on which template engine you configure.

Depending on the return value, Nails will pass a different set of parameters to
the view engine:
* <undefined> If there is no return statement in the action, Nails will pass the
  <params> obect to the rendering engine.
* <Object> If a generic object is returned, Nails will attempt to autorender the
  view immediately using the returned object instead of <params>.
* <Promise> If a promise is returned, Nails will wait to autorender the view
  until the <Promise> resolves. If it resolves with no return value, the view
  is rendered using <params>. Otherwise, the view is rendered using the resolved
  value of the <Promise>
* <Controller.DISABLE_AUTORENDER> The controller class defines a static constant
  you can use to disable Nails autorendering. Nails will wait for the <action>
  to explicitly send a response to the client. If the action takes to long to
  send a response, Nails will respond to the client with a timeout error.

###### Params
Params is a generic JSON object which represents the request details. Usually,
Params will correspond to the query portion of your request.

For example, a GET request to <//some/path?item0=a&item1=b> will generate the
params object:
``` js
{
  item0: "a",
  item1: "b"
}
```

###### Request
An express Request object.

###### Response
The response object provided by <express.js>. The <#render()> method has been
overridden to allow for the rendering of views by name.

#### Model

Models are programmatic representations of data you wish to persist in a database.  They are a special kind of object which
come with 'save()' and 'fetch()' methods to (respectively) persist the model to the database or retrieve the model from the database and update
its attributes. Consider app/models/user.js:

``` js
module.exports = function User(attr) {
    this.set('name', attr.name);
    this.set('age', attr.name);
}
```

When you execute the following code in your nails service, you create a user
with the specified name and age, and save it to the database:

``` js
    // require user constructor
    var User = require('<service root>/app/models/user.js');
    // create a user instance
    var u = new User({name: 'foobar', age: 25});
    // save the user to the database
    u.save();
```

And voila! The user is now available for future requests:

``` js
    var u2 = new User();
    u2.id = <id of a persisted user>;

    // now update u2 with the data from the databse
    u2.fetch();
```

Note that Nails extends your model objects with the methods needed for interacting with a database, so
you can focus on business logic.

#### View
Views are basically templates used to render an html response for a browser.
Nails comes prepackaged with React.js serverside templating, and EJS templates.
If no template engine is specified in the service config, Nails will Default to
EJS. Nails will always attempt to autorender your views unless the <action>
returns <Controller.DISABLE_AUTORENDER>. If you disable autorender in an action,
you must explicitly send a response using the express Response object.

Stay tuned as nails evolves:

* Intuitive support for template engines
* Server/client redirects
* Custom Request middleware
* Fancy Logging
* Sessions
* Custom ORM/ODM support
* Server security
*

Enjoy! Feature requests, bug reports, and comments are welcome on github.
