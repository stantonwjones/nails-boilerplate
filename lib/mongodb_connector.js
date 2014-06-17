// TODO: multiple async requests here... need to
// consider how this will be used by the models
var EventEmitter = require('events').EventEmitter;
var mongodb = require('mongodb');

module.exports = MongoDBConnector;

// TODO: need to deal with clustered databases...

MongoDBConnector.prototype.__proto__ = EventEmitter.prototype;
function MongoDBConnector(config) {
    EventEmitter.call(this);
    this.exec_once_connected = [];
    this.server_connection = mongodb.Server(config.url, config.port);
    this._db = new mongodb.Db(config.database,
            this.server_connection);
    // TODO: insure failed connection raises error.
    this._db.open(function(err, db){});
}

/**
 * Need to implement these methods for a connector to work
 */
// maybe use rest methods as names for any database connector used...
MongoDBConnector.prototype.create = function(model) {
    this._db.collection(model.collection_name()).insert(model.attributes);
}
// update a record in the collection
MongoDBConnector.prototype.update = function(model) {
}
// return a single record from a collection
MongoDBConnector.prototype.show = function(model) {
}
// return multiple records from a collection
MongoDBConnector.prototype.find = function(model) {
}
// delete a record from a collection
MongoDBConnector.prototype.destroy = function(model) {
}
// resets attributes from db
MongoDBConnector.prototype.refresh = function(model) {
}
