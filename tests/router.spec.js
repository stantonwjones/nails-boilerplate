import { describe, it, expect, beforeEach } from 'vitest';
import Router from '../lib/Router.ts';
import express_app from '../lib/application.ts';

express_app.set("public_root", import.meta.dirname + "/services/integration/public");
const testRoutes = [
    ['GET', '^/$', {controller: 'testController', action: 'testAction'}],
    ['GET', /^\/public\/*/, {public: true}]
];

let router;

describe('Router', () => {
    describe('route', () => {
        beforeEach(() => {
            router = new Router(testRoutes);
        });

        it(`should emit dispatchTo:application if a registered controller does
            not match the action`, async () => {
            const mockRequest = {
                method: 'get',
                url: 'http://www.test.com/public/test.html'
            };
            const mockResponse = {};
            const expectedAction = 404;

            const dispatchPromise = new Promise(resolve => {
                router.on('dispatchTo:application', ({action, params, request, response}) => {
                    resolve({action, params, request, response});
                });
            });

            router.route(mockRequest, mockResponse);

            const {action, params, request, response} = await dispatchPromise;

            expect(action).toEqual(expectedAction);
            expect(typeof(params)).toBe('object');
            expect(params.file).toBeUndefined();
            expect(request).toBe(mockRequest);
            expect(response).toBe(mockResponse);
        });

        it('should emit dispatch:<controller> event based on the params', async () => {
            const mockParams = {
              _controller: "test",
              _action: "testAction"
            };
            const mockRequest = {
                method: 'get',
                url: 'http://www.test.com/',
                params: mockParams
            };
            const mockResponse = {};
            const expectedAction = 'testAction';

            const dispatchPromise = new Promise(resolve => {
                router.on('dispatchTo:test', ({action, params, request, response}) => {
                    resolve({action, params, request, response});
                });
            });

            router.route(mockRequest, mockResponse);

            const {action, params, request, response} = await dispatchPromise;

            expect(action).toEqual(expectedAction);
            expect(params._controller).toEqual(mockParams._controller);
            expect(params._action).toEqual(mockParams._action);
            expect(request).toBe(mockRequest);
            expect(response).toBe(mockResponse);
        });

        it("should emit dispatch:<controller> event based on the url query", async () => {
            const mockQuery = {
              _controller: "test",
              _action: "testAction"
            };
            const mockRequest = {
                method: 'get',
                url: 'http://www.test.com/',
                query: mockQuery
            };
            const mockResponse = {};
            const expectedAction = 'testAction';

            const dispatchPromise = new Promise(resolve => {
                router.on('dispatchTo:test', ({action, params, request, response}) => {
                    resolve({action, params, request, response});
                });
            });

            router.route(mockRequest, mockResponse);

            const {action, params, request, response} = await dispatchPromise;

            expect(action).toEqual(expectedAction);
            expect(params._controller).toEqual(mockQuery._controller);
            expect(params._action).toEqual(mockQuery._action);
            expect(request).toBe(mockRequest);
            expect(response).toBe(mockResponse);
        });
    });
});
