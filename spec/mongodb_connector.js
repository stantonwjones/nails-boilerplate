var assert = require('assert');
var MongoDBConnector = require('../lib/mongodb_connector.js');
var test_config = {
    url: 'localhost',
    port: '27017',
    database: 'test'
}

var mdbc = new MongoDBConnector(test_config);

describe('MongoDBConnector', function(done) {
    it('should create a new connection to mongodb', function(done) {
        mdbc._db.on('open', function(){done()});
    });
    describe('#save', function() {
    });
    describe('#find', function() {
    });
    describe('#create', function() {
        var test_model = {
            collection_name: function() {return 'test_model'},
            attributes: {
                x: 'x'
            }
        }
        mdbc.create(test_model);
        assert.ok(test_mode.attributes._id);
    });
});
