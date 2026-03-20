import { describe, it, expect, vi } from 'vitest';
import Controller from '../lib/Controller.ts';
import {EventEmitter} from 'node:events';

class TestController extends Controller {
    testAction() {};
};

class TestEs6Controller extends Controller {
  testEs6Action() {

  }

}

describe('Controller', () => {
  describe('Controller.setRouter', () => {
    it('should set Controller.router to the router', () => {
      const router = {};
      Controller.setRouter(router);
      expect(Controller.router).toBe(router);
    });
  });
  describe('Controller.constructor', () => {
    it('should set the appropriate listener on the router',
        () => {
      const mockRouter = new EventEmitter();
      const mockParams = {_controller: "test"};
      const mockRequest = {};
      const mockResponse = {headersSent: true};
      Controller.setRouter(mockRouter);
      const testController = new TestEs6Controller();
      const spy = vi.spyOn(testController, "testEs6Action");

      mockRouter.emit(
        'dispatchTo:testes6',
        {action: 'testEs6Action', params: mockParams, request: mockRequest, response: mockResponse});

      expect(spy).toHaveBeenCalledWith(
          mockParams, mockRequest, mockResponse);
    });
  });
  describe('#_do', () => {
    it.todo('should call the function on the controller matching the given action');
    it.todo('should call 404 if the action does not exist on the controller instance');
    it.todo('should call 500 if the action throws an error');
    it.todo('should attempt to render a view');
    it.todo('should not render a view if data has already been sent to the client');
    it.todo('should not render a view if _async is true');
    it.todo('should not render a view if async is true on the action');
  });
  describe('#404', () => {
    it.todo('should test something');
  });
  describe('#500', () => {
    it.todo('should test something');
  });
  describe('#public', () => {
    it.todo('should test something');
  });
});
