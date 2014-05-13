// TODO: multiple async requests here... need to
// consider how this will be used by the models
var mongodb = require('mongodb');
var server_connection = mongodb.Server(url, port);
var db_connection = mongodb.Db(database);

db_connection.open(function(error, db) {
});
db.on('error', function(error, db) {
});
db.once('open', function() {
});
