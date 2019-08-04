module.exports = {
  //connector: 'sqlite3_connector.js',
  connector: 'mongoose_connector.js',
  uri: 'mongodb://localhost:27017/development'
  //url: 'mongodb://localhost',
  //port: '27017',
  //database: 'development',

  // For the sqlite3 connector. Unless a filename is defined, an in-memory
  // database is used. In-memory databases are not persisted, and will be lost
  // when the server is restarted.
  //filename: ':memory:'
}
