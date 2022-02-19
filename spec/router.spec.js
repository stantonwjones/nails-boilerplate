var Router = require('../lib/router.js');
var assert = require('assert');
var express_app = require('../lib/application.js');
express_app.set("public_root", __dirname + "/services/integration/public");
var testRoutes = [
    ['GET', '^/$', {controller: 'testController', action: 'testAction'}],
    ['GET', /^\/public\/*/, {public: true}]
];

var router;

describe('Router', function() {
    describe('route', function() {
        beforeEach(function() {
            router = new Router(testRoutes);
        });
        it(`should emit dispatchTo:application if a registered controller does
            not match the action`,
          function(done) {
            var mockRequest = {
                method: 'get',
                url: 'http://www.test.com/public/test.html'
            };
            var mockResponse = {};
            var expectedAction = '404';
            var testFunctionCalled;
            router.on('dispatchTo:application', test);

            function test(action, params, request, response) {
                testFunctionCalled = true;
                assert.equal(action, expectedAction);
                assert.equal(typeof(params), 'object');
                assert.equal(params.file, undefined);
                assert.equal(request, mockRequest);
                assert.equal(response, mockResponse);
                done();
            }
            router.route(mockRequest, mockResponse);
            if (!testFunctionCalled) done('testFailed');
        });
        it('should emit dispatch:<controller> event based on the params',
          function(done) {
            const mockParams = {
              _controller: "test",
              _action: "testAction"
            };
            var mockRequest = {
                method: 'get',
                url: 'http://www.test.com/',
                params: mockParams
            };
            var mockResponse = {};
            var expectedAction = 'testAction';
            var testFunctionCalled;
            router.on('dispatchTo:test', test);

            function test(action, params, request, response) {
                testFunctionCalled = true;
                assert.equal(action, expectedAction);
                assert.equal(params._controller, mockParams._controller);
                assert.equal(params._action, mockParams._action);
                assert.equal(request, mockRequest);
                assert.equal(response, mockResponse);
                done();
            }
            router.route(mockRequest, mockResponse);
            if (!testFunctionCalled) done('testFailed');
        });
        it("should emit dispatch:<controller> event based on the url query",
          function(done) {
            const mockQuery = {
              _controller: "test",
              _action: "testAction"
            };
            var mockRequest = {
                method: 'get',
                url: 'http://www.test.com/',
                query: mockQuery
            };
            var mockResponse = {};
            var expectedAction = 'testAction';
            var testFunctionCalled;
            router.on('dispatchTo:test', test);

            function test(action, params, request, response) {
                testFunctionCalled = true;
                assert.equal(action, expectedAction);
                assert.equal(params._controller, mockQuery._controller);
                assert.equal(params._action, mockQuery._action);
                assert.equal(request, mockRequest);
                assert.equal(response, mockResponse);
                done();
            }
            router.route(mockRequest, mockResponse);
            if (!testFunctionCalled) done('testFailed');
          }
        );
    });
});
