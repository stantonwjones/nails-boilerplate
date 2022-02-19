var assert = require('assert');
const MongoDBConnectorUtil = require("./mongodb_connector.util.js");

describe('MongoDBConnector', function() {
  var util;
  var mdbc;
  beforeEach(function(done) {
    util = new MongoDBConnectorUtil();
    util.getTestConnector().then(connector => {
      mdbc = connector;
      connector.on("connected", done);
    });
  });
  afterEach(function(done) {
    util.cleanup().then(() => done());
  });
  it('should create a new connection to mongodb', function(done) {
    assert.notEqual(mdbc._db, null);
    done();
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
      it('should return a single document with the matching _id', async function() {
        var test_model = get_test_model('custom0');
        var test_attr = test_model.attributes;
        await mdbc._post_one(test_model.collection_name(), test_attr);
        let doc = await mdbc._get_one(test_model.collection_name(),
        test_model.attributes._id, null);
        assert.ok(doc.custom_attr == test_attr.custom_attr);
        assert.ok(doc._id.equals(test_attr._id));
        return null;
      });
    });
    describe('#_get_many', function() {
      it('should return all documents matching the collection._query field');
    });
  });
  describe('Document Creation', function(){
    describe('#_post_one', function() {
      it('should set an _id attribute on the given attributes hash', function(done) {
        var test_model = get_test_model();
        mdbc._post_one(test_model.collection_name(), test_model.attributes)
          .then(() => {
            assert.ok(test_model.attributes._id);
            done();
          });
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
