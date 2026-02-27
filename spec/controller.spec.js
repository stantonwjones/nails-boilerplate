import Controller from '../lib/Controller.ts';
import assert from 'assert';
import sinon from 'sinon';
import {EventEmitter} from 'node:events';

class TestController extends Controller {
    testAction() {};
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
        'dispatchTo:testes6',
        {action: 'testEs6Action', params: mockParams, request: mockRequest, response: mockResponse});

      assert(testController.testEs6Action.calledWith(
          mockParams, mockRequest, mockResponse));
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
