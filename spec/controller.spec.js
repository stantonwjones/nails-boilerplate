import Controller from '../lib/controller.js';
import assert from 'assert';
import sinon from 'sinon';
import {EventEmitter} from 'node:events';

function TestController() {
    this.testAction = function () {};
};

class TestEs6Controller extends Controller {
  testEs6Action() {

  }

}

describe('Controller', function() {
  describe('Controller.setRouter', function() {
    it('should set Controller.router to the router', function() {
      var router = {};
      Controller.setRouter(router);
      assert(Controller.router === router);
    });
  });
  describe('Controller.constructor', function() {
    it('should set the appropriate listener on the router',
        function() {
      let mockRouter = new EventEmitter();
      let mockParams = {_controller: "test"};
      let mockRequest = {};
      let mockResponse = {headersSent: true};
      Controller.setRouter(mockRouter);
      let testController = new TestEs6Controller();
      sinon.spy(testController, "testEs6Action");

      mockRouter.emit(
        'dispatchTo:testes6', 'testEs6Action', mockParams, mockRequest, mockResponse);

      assert(testController.testEs6Action.calledWith(
          mockParams, mockRequest, mockResponse));
    });
  });
  describe('Controller.extend', function() {
    it('should error if an anonymous function is passed', function() {
      try {
        let testController = Controller.extend(function(){});
        assert(false); // Fail if we get here.
      } catch(e) {
      }
    });

    it('should set the appropriate listener on the router',
        function() {
      let mockRouter = new EventEmitter();
      let mockParams = {_controller: "test"};
      let mockRequest = {};
      let mockResponse = {headersSent: true};
      Controller.setRouter(mockRouter);
      let testController = Controller.extend(TestController);
      sinon.spy(testController, "testAction");

      mockRouter.emit(
        'dispatchTo:test', 'testAction', mockParams, mockRequest, mockResponse);

      assert(testController.testAction.calledWith(
          mockParams, mockRequest, mockResponse));
    });
    it('should set itself as the prototype of the passed constructor method',
      function() {
        let mockRouter = new EventEmitter();
        Controller.setRouter(mockRouter);
        let testController = Controller.extend(TestController);
        assert(testController instanceof Controller);
      }
    );
    it('should return an initialized instance of the constructor', function() {
      let mockRouter = new EventEmitter();
      Controller.setRouter(mockRouter);
      let testController = Controller.extend(TestController);
      assert(testController instanceof TestController);
    });
    it('should raise an error if no router has been set', function() {
      try {
        let testController = Controller.extend(TestController);
        assert(false); // Fail if we get here.
      } catch (expectedError) {
      }
    });
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
