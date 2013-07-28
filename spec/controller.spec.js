var Controller = require('../lib/controller.js');
function TestConstructor() {
    this.test
};
describe('Controller', function() {
    describe('#Controller.setRouter', function() {
        it('should set Controller.router to the router');
    });
    dexcribe('#Controller.extend', function() {
        it('should set the appropriate listener on the router');
        it('should set itself as the prototype of the passed constructor method');
        it('should return an initialized instance of the constructor');
        it('should raise an error if no router has been set');
    });
    describe('#_do', function() {
        it('should call the function on the controller matching the given action');
        it('should call 404 if the action does not exist on the controller instance');
        it('should call 500 if the action throws an error');
    });
    describe('#404', function() {
    });
    describe('#500', function() {
    });
    describe('public', function() {
    });
});
