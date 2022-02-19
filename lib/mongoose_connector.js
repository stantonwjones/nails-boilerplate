const mongoose = require('mongoose');

class MongooseDbConnector {
  async connect(options) {
    if (options.uri) {
      this.connection = await mongoose.createConnection(options.uri/*, mongooseOptions*/).asPromise();
      debugger;
    } else {
      var url = options.url || 'mongodb://127.0.0.1';
      var port = options.port || '27017';
      var database = options.database || options.dbName || 'nails';
      this.connection = await mongoose.createConnection(`${url}:${port}/${database}`).asPromise();
    }
  }

  generateModelSuperclass(name, options) {
    let schema = options.schema instanceof mongoose.Schema
      ? options.schema
      : new mongoose.Schema(options.schema);
    if (options.indexes) {
      options.indexes.forEach(index => schema.index(index));
    }
    return this.connection.model(name, options.schema);
  }
}
module.exports = MongooseDbConnector;
/*
module.exports.connect = function(options) {
  if (options.uri) return mongoose.createConnection(options.uri, mongooseOptions);
  else {
    var url = options.url || 'mongodb://localhost';
    var port = options.port || '27017';
    var database = options.database || 'nails';
    return mongoose.createConnection(`${url}:${port}/${database}`, mongooseOptions);
  }
}

module.exports.generateModelSuperclass = function(name, options) {
  let schema = options.schema instanceof mongoose.Schema
    ? options.schema
    : new mongoose.Schema(options.schema);
  if (options.indexes) {
    options.indexes.forEach(index => schema.index(index));
  }
  return mongoose.model(name, options.schema);
}
*/
