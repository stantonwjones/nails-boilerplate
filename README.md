# Nails-Boilerplate: A Node Webserver Framework

This framework is designed to provide a lightweight, configurable MVC backend
for node developers.  With minimal dependencies, Nails offers a greater syntactical
familiarity than php alongside the creative freedom of bleeding edge solutions
like Rails and Django.

This boilerplate offers the basic necessities to get your MVC site off the ground.
The modules used in Nails Boilerplate can be easily extended to produce the custom
functionality to fit your needs, and you are encouraged to do so.

### Install

    sudo npm install -g nails-boilerplate
    
    nails init <app_name>

This will initialize a barebones app in the directory of the same name.  Take a
look at the self-documented config files and example controller and view before
getting started.  Additional controllers and views will automatically be imported
into nails.  Now just hook the new controllers in with some new routes and you're
off to a good start.  Untill further notice, you will have to run npm install to
install dependencies prior to running your application.

Though the past builds have dealt with changing syntax, the architecture and style
of nails has been finalized and will not change with the addition of the following
upcoming features:
   
* Intuitive support for template engines
* Server/client redirects
* Request middleware
* Logging
* Cookies/Session support
* ORM/ODM supported models
* Server security

Enjoy! Feature requests, bug reports, and comments are welcome on github.
