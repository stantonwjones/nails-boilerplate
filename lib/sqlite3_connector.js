// TODO: multiple async requests here... need to
// consider how this will be used by the models
var EventEmitter = require('events').EventEmitter;
const DBClient = require('sqlite3');
const test = require('assert');

module.exports = SQLite3Connector;

// TODO: need to deal with clustered databases...

SQLite3Connector.prototype.__proto__ = EventEmitter.prototype;
function SQLite3Connector(config) {
  EventEmitter.call(this);
  var url = config.url || 'mongodb://localhost';
  var port = config.port || '27017';
  var database = config.database || 'nails';
  this.exec_once_connected = [];
  this._db = new DBClient.Database(config.filename);
}

/**
 * Need to implement these methods for a connector to work
 */
// maybe use rest methods as names for any database connector used...
SQLite3Connector.prototype.post = function(model_or_collection) {
    if (model_or_collection.is_model) 
        this._post_one(model_or_collection._collection_name(), 
            model_or_collection.attributes);
}
SQLite3Connector.prototype._post_one = function(collection_name, doc_attributes, callback) {
    this._db.collection(collection_name).insert(doc_attributes);
}
SQLite3Connector.prototype._post_many = function(collection) {
    this._db.collection(collection.name())
        .save(collection.model_attributes());
}

// update a record in the collection
SQLite3Connector.prototype.put = function(model_or_collection) {
    if (model_or_collection.is_model)
        this._put_one(model_or_collection._collection_name(), model_or_collection.attributes);
}
SQLite3Connector.prototype._put_one = function(collection_name, doc) {
    // TODO: replacing document completely is sow
    // will want to only send changed attr
    // TODO: write concerns?
    this._db.collection(collection_name).update({_id: doc._id}, doc);
}
/**
 * _put_many will call _update on each individual object in collection
 * if that object has changed
 */
SQLite3Connector.prototype._put_many = function(collection) {
}

// return a single record from a collection
// or a collection of records if requested...
// if a model or collection is passed, 
SQLite3Connector.prototype.get = function(model_or_collection) {
    if (model_or_collection.is_model)
        this._get_one(model_or_collection._collection_name(), model_or_collection.id, null,
                this._on_doc_response.bind(model_or_collection));
}
SQLite3Connector.prototype._get_one = function(collection_name, id, options, callback) {
    options = options || {};
    this._db.collection(collection_name).findOne(id, options, callback);
}
SQLite3Connector.prototype._get_many = function(collection) {
    return this._db.collection(collection.name()).find({
        _id: collection.collect('_id')});
}

// delete a record from a collection
SQLite3Connector.prototype.delete = function(model) {
    return this._db.collection(model.collection_name())
        .remove(model.attributes._id);
}
// SQLite3Connector.prototype._delete_one
// SQLite3Connector.prototype._delete_many

SQLite3Connector.prototype._on_doc_response = function(err, doc) {
    if (err) return console.log('error retrieving from', collection_name, '\n', err);
    delete doc._id;
    this._merge_attributes(doc);
}
