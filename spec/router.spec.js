var Router = require('../lib/router.js');
var assert = require('assert');
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
        it('should emit dispatchTo:ApplicationController event on static file request', function(done) {
            var mockRequest = {
                method: 'get',
                url: 'http://www.test.com/public/test.html'
            };
            var mockResponse = {};
            var expectedAction = 'file';
            var testFunctionCalled;
            router.on('dispatchTo:ApplicationController', test);
            
            function test(action, params, request, response) {
                testFunctionCalled = true;
                assert.equal(action, expectedAction);
                assert.equal(typeof(params), 'object');
                assert.equal(params.file, '/public/test.html');
                assert.equal(request, mockRequest);
                assert.equal(response, mockResponse);
                done();
            }
            router.route(mockRequest, mockResponse);
            if (!testFunctionCalled) done('testFailed');
        });
        it('should emit dispatch:<controller> event if a static file is not requested', function(done) {
            var mockRequest = {
                method: 'get',
                url: 'http://www.test.com/'
            };
            var mockResponse = {};
            var expectedAction = 'testAction';
            var testFunctionCalled;
            router.on('dispatchTo:testController', test);
            
            function test(action, params, request, response) {
                testFunctionCalled = true;
                assert.equal(action, expectedAction);
                assert.equal(typeof(params), 'object');
                assert.equal(request, mockRequest);
                assert.equal(response, mockResponse);
                done();
            }
            router.route(mockRequest, mockResponse);
            if (!testFunctionCalled) done('testFailed');
        });
        it('should emit verifyRoute event on each controller dispatch', function(done) {
            var mockRequest = {
                method: 'get',
                url: 'http://www.test.com/genericFail'
            };
            var mockResponse = {};
            var testFunctionCalled;
            router.on('verifyRoute', test);
            
            function test(controller, request, response) {
                testFunctionCalled = true;
                //assert.equal(action, expectedAction);
                //assert.equal(typeof(controller), 'string');
                assert.equal(request, mockRequest);
                assert.equal(response, mockResponse);
                done();
            }
            router.route(mockRequest, mockResponse);
            if (!testFunctionCalled) done('testFailed');
        });
    });
});
