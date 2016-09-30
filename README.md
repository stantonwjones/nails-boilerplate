# Nails-Boilerplate: A Node Webserver Framework

This framework is designed to provide a lightweight, configurable MVC backend
for node developers.  With minimal dependencies, Nails offers a greater syntactical
familiarity than php alongside the creative freedom of bleeding edge solutions
like Rails and Django.

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

### API

For your convenience, here is a quick outline of the main components of a nails application.
Remember: each object comes with an example file to use for reference when building your application.

#### Config

Your configuration files are stored in app_name/config/. There are three default config files:

```
application.js
routes.js
db.js
```

Each default config file is annotated with comments documenting each field to help you tailor your application to your needs.

##### application.js

application.js contains information necessary to run your server. By default, it specifies the port and the location of important libraries. To override these values in different runtime environments, add a child object.
```js
module.exports = {
  ...
  PORT: 3000,
  PROD: {
    PORT: 80
  }
}
```

Nails checks the NODE_ENV environment variable. If a matching child config object is present, then those values will override the parent config. In the above example, PORT will be overridden to 80 if NODE_ENV is set to PROD.

While most of these values don't need to be changed, feel free to add custom fields. The resulting config will be available to your application through the nails module:

```js
var application_config = require('nails-boilerplate').config
```

If the config contains a custom field,

```js
module.exports = {
  ...
  PORT: 3000,
  yourCustomField: 'yourCustomValue'
}
```

then `application_config.yourCustomField` as defined above will be equal to `'yourCustomValue'`.

##### routes.js
-- Coming soon... For now, take a look at the files in the example config directory --
##### db.js
-- Coming soon... For now, take a look at the files in the example config directory --

#### Controller

Controllers are defined in app/controllers/. Each controller module should define a constructor (named function)
to be used when initializing the controller. The name of the controller will be used to match routes defined in
config/routes.js for incoming requests.  Methods on the controller can be used to match actions, receiving <params>,
<request>, <response> as arguments. For Example:
    
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

defines a controller which will match any route to 'home#<action>'. "index" and "signin" are actions which
can be used to render a response to the client.

###### Params
Docs coming soon...

###### Request
Docs coming soon...

###### Response

The response object provided by <express.js>. The <#render()> method has been overridden to allow for the rendering of views by name.

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

When we execute the following code in the nails application, we create a user with the specified name and age, and save it to the database:

``` js
    // require user constructor
    var User = require('<application root>/app/models/user.js');
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
Docs coming soon...

Stay tuned as nails evolves:

* Intuitive support for template engines
* Server/client redirects
* Custom Request middleware
* Fancy Logging
* Sessions
* Custom ORM/ODM support
* Server security

Enjoy! Feature requests, bug reports, and comments are welcome on github.
