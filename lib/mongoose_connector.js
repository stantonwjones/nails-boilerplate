const mongoose = require('mongoose');
const mongooseOptions = {useNewUrlParser: true};

module.exports.connect = function(options) {
  if (options.uri) mongoose.connect(options.uri, mongooseOptions);
  else {
    var url = options.url || 'mongodb://localhost';
    var port = options.port || '27017';
    var database = options.database || 'nails';
    mongoose.connect(`${url}:${port}/${database}`, mongooseOptions);
  }
}

module.exports.generateModelSuperclass = function(name, options) {
  return mongoose.model(name, options.schema);
}
