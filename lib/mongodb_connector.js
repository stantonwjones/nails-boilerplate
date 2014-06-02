// TODO: multiple async requests here... need to
// consider how this will be used by the models
var mongodb = require('mongodb');

module.exports = MongoDBConnector;

// TODO: need to deal with clustered databases...

function MongoDBConnector(config) {
    this.server_connection = mongodb.Server(config.url, config.port);
    this.db_connection = new mongodb.Db(config.database,
            this.server_connection);
    // TODO: insure failed connection raises error.
    // TODO: try to prevent requests from coming until connection is
    // established.
    this.db_connection.open(function(error, db) {
        this._db = db;
    }.bind(this));
}

/**
 * Need to implement these methods for a connector to work
 */
// maybe use rest methods as names for any database connector used...
MongoDBConnector.prototype.create = function(model) {
    this._db.insert({
        insert: model.collection_name();
        // TODO: other attributes. check mongodb website
    });
}
// update a record in the collection
db_connector.update = function(model) {
}
// return a single record from a collection
db_connector.show = function(model) {
}
// return multiple records from a collection
db_connector.find = function(model) {
}
// delete a record from a collection
db_connector.destroy = function(model) {
}
