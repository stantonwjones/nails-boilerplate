const mongoose = require('mongoose');
const mongooseOptions = {useNewUrlParser: true};

module.exports.connect = function(options) {
  if (options.uri) mongoose.connect(options.uri, mongooseOptions);
  else {
    var url = config.url || 'mongodb://localhost';
    var port = config.port || '27017';
    var database = config.database || 'nails';
    mongoose.connect(`${url}:${port}/${database}`, mongooseOptions);
  }
}

module.exports.generateModelSuperclass = function(name, options) {
  return mongoose.model(name, options.schema);
}
