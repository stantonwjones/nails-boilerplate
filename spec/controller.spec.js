var Controller = require('../lib/controller.js');
var assert = require('assert');
function TestConstructor() {
    this.test = function () {};
};
describe('Controller', function() {
  describe('Controller.setRouter', function() {
    it('should set Controller.router to the router', function() {
      var router = {};
      Controller.setRouter(router);
      assert(Controller.router === router);
    });
  });
  describe('Controller.extend', function() {
    it('should error if an anonymous function is passed', function() {
      try {
        testController = Controller.extend(function(){});
        assert(false); // Fail if we get here.
      } catch(e) {
      }
    });

    it('should set the appropriate listener on the router');
    it('should set itself as the prototype of the passed constructor method');
    it('should return an initialized instance of the constructor');
    it('should raise an error if no router has been set');
  });
  describe('#_do', function() {
    it('should call the function on the controller matching the given action');
    it('should call 404 if the action does not exist on the controller instance');
    it('should call 500 if the action throws an error');
    it('should attempt to render a view');
    it('should not render a view if data has already been sent to the client');
    it('should not render a view if _async is true');
    it('should not render a view if async is true on the action');
  });
  describe('#404', function() {
  });
  describe('#500', function() {
  });
  describe('#public', function() {
  });
});
