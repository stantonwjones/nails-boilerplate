var assert = require('assert');
var MongoDBConnector = require('../lib/mongodb_connector.js');
var test_config = {
    url: 'localhost',
    port: '27017',
    database: 'test'
}

var mdbc = new MongoDBConnector(test_config);

describe('MongoDBConnector', function() {
    it('should create a new connection to mongodb', function(done) {
        mdbc._db.on('open', function(){done()});
    });
    describe('#put', function() {
        it('should be ok, updating the record in the database');
    });
    describe('Document retrieval', function() {
        describe('#get', function() {
            it('should return a single document when model is passed');
            it('should return an array of docments when collection is passed');
        });
        describe('#_get_one', function() {
            it('should return a single document with the matching _id', function(done) {
                var test_model = get_test_model('custom0');
                var test_attr = test_model.attributes;
                mdbc._post_one(test_model.collection_name(), test_attr);
                debugger;
                mdbc._get_one(test_model.collection_name(),
                    test_model.attributes._id, null, 
                    function(err, doc) {
                        assert.ok(!err);
                        assert.ok(doc.custom_attr == test_attr.custom_attr);
                        assert.ok(doc._id.equals(test_attr._id));
                        done();
                });
            });
        });
        describe('#_get_many', function() {
            it('should return all documents matching the collection._query field');
        });
    });
    describe('Document Creation', function(){
        describe('#_post_one', function() {
            it('should set an _id attribute on the given attributes hash', function() {
                var test_model = get_test_model();
                mdbc._post_one(test_model.collection_name(), test_model.attributes);
                assert.ok(test_model.attributes._id);
            });
        });
    });
});
function get_test_model(custom_attr) {
    return {
        collection_name: function() {return 'test_model'},
        attributes: {
            x: 'x',
            custom_attr: custom_attr
        }
    }
}
