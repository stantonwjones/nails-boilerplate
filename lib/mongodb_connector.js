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
  var uri =
      config.uri ? config.uri : `${url}:${port}/${database}`;
  this.exec_once_connected = [];
  var that = this;
  MongoClient.connect(uri)
      .then(client => {
        this._client = client;
        this._db = client.db(database);
        this.emit("connected");
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
      return this._post_one(model_or_collection._collection_name(),
          model_or_collection.attributes);
}
MongoDBConnector.prototype._post_one = function(collection_name, doc_attributes, callback) {
  return this._db.collection(collection_name).insert(doc_attributes);
}
MongoDBConnector.prototype._post_many = function(collection) {
  return this._db.collection(collection.name())
      .save(collection.model_attributes());
}

// update a record in the collection
MongoDBConnector.prototype.put = function(model_or_collection) {
  if (model_or_collection.is_model)
      return this._put_one(
        model_or_collection._collection_name(),
        model_or_collection.attributes);
}
MongoDBConnector.prototype._put_one = function(collection_name, doc) {
  // TODO: replacing document completely is sow
  // will want to only send changed attr
  // TODO: write concerns?
  return this._db.collection(collection_name).replaceOne({_id: doc._id}, doc);
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
      return this._get_one(model_or_collection._collection_name(), model_or_collection.id, null)
          .then(doc => this._on_doc_response(model_or_collection, doc));
}
MongoDBConnector.prototype._get_one = function(collection_name, id, options) {
  options = options || {};
  return this._db.collection(collection_name).findOne(id, options);
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

MongoDBConnector.prototype._on_doc_response = function(model_or_collection, doc) {
  // move this to the promise catch block: if (err) return console.log('error retrieving from', collection_name, '\n', err);
  delete doc._id;
  model_or_collection._merge_attributes(doc);
}
