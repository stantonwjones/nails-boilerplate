// TODO: multiple async requests here... need to
// consider how this will be used by the models
var EventEmitter = require('events').EventEmitter;
const MongoClient = require('mongodb').MongoClient;
const test = require('assert');

module.exports = MongoDBConnector;

// TODO: need to deal with clustered databases...

MongoDBConnector.prototype.__proto__ = EventEmitter.prototype;
function MongoDBConnector(config) {
    EventEmitter.call(this);
    var url = config.url || 'mongodb://localhost';
    var port = config.port || '27017';
    var database = config.database || 'nails';
    this.exec_once_connected = [];
    MongoClient.connect(url + ':' + port)
        .then(client => {
          this._client = client;
          this._db = client.db(database);
        }).catch(error => {
          // TODO: better handling of the failed connection
          console.error(error);
          throw error;
        });
}

/**
 * Need to implement these methods for a connector to work
 */
// maybe use rest methods as names for any database connector used...
MongoDBConnector.prototype.post = function(model_or_collection) {
    if (model_or_collection.is_model) 
        this._post_one(model_or_collection._collection_name(), 
            model_or_collection.attributes);
}
MongoDBConnector.prototype._post_one = function(collection_name, doc_attributes, callback) {
    this._db.collection(collection_name).insert(doc_attributes);
}
MongoDBConnector.prototype._post_many = function(collection) {
    this._db.collection(collection.name())
        .save(collection.model_attributes());
}

// update a record in the collection
MongoDBConnector.prototype.put = function(model_or_collection) {
    if (model_or_collection.is_model)
        this._put_one(model_or_collection._collection_name(), model_or_collection.attributes);
}
MongoDBConnector.prototype._put_one = function(collection_name, doc) {
    // TODO: replacing document completely is sow
    // will want to only send changed attr
    // TODO: write concerns?
    this._db.collection(collection_name).update({_id: doc._id}, doc);
}
/**
 * _put_many will call _update on each individual object in collection
 * if that object has changed
 */
MongoDBConnector.prototype._put_many = function(collection) {
}

// return a single record from a collection
// or a collection of records if requested...
// if a model or collection is passed, 
MongoDBConnector.prototype.get = function(model_or_collection) {
    if (model_or_collection.is_model)
        this._get_one(model_or_collection._collection_name(), model_or_collection.id, null,
                this._on_doc_response.bind(model_or_collection));
}
MongoDBConnector.prototype._get_one = function(collection_name, id, options, callback) {
    options = options || {};
    this._db.collection(collection_name).findOne(id, options, callback);
}
MongoDBConnector.prototype._get_many = function(collection) {
    return this._db.collection(collection.name()).find({
        _id: collection.collect('_id')});
}

// delete a record from a collection
MongoDBConnector.prototype.delete = function(model) {
    return this._db.collection(model.collection_name())
        .remove(model.attributes._id);
}
// MongoDBConnector.prototype._delete_one
// MongoDBConnector.prototype._delete_many

MongoDBConnector.prototype._on_doc_response = function(err, doc) {
    if (err) return console.log('error retrieving from', collection_name, '\n', err);
    delete doc._id;
    this._merge_attributes(doc);
}
