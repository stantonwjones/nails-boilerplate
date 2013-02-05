var Router = require('../lib/router.js');
var testRoutes = [
    ['GET', '/', {controller: 'testController', action: 'testAction'}],
    ['GET', '/^\/public\/*/', {public: true}]
];

var router = new Router(testRoutes);

describe('Router', function() {
    describe('route', function() {
        //beforeeach here maybe...
        it('should emit dispatchTo:ApplicationController event on static file request', function() {
            var mockRequest = {
                method: 'get',
                url: 'http://www.test.com/public'
            };
            var mockResponse = {};
            router.route(mockRequest, mockResponse);
            router.emit.calledWith(
                'dispatchTo:ApplicationController',
                'file',
                '/public',
                mockRequest,
                mockResponse
            ).should.be.true;
        });
        it('should emit dispatch:<controller> event if a static file is not requested', function() {
            var mockRequest = {
                method: 'get',
                url: 'http://www.test.com/'
            };
            var mockResponse = {};
            router.route(mockRequest, mockResponse);
            router.emit.calledWith(
                'dispatchTo:testController',
                'testAction'
                // TODO: wrap request and response into a Session object
            ).should.be.true;
        });
        it('should emit verifyRoute event on each controller dispatch', function() {
            var mockRequest = {
                method: 'get',
                url: 'http://www.test.com/'
            };
            var mockResponse = {};
            router.route(mockRequest, mockResponse);
            router.emit.calledWith(
                'dispatchTo:ApplicationController',
                'verifyRoute',
                'testController',
                mockRequest,
                mockResponse
            ).should.be.true;
        });
    });
});
