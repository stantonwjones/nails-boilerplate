module.exports = {
  //connector: 'sqlite3_connector.js',
  connector: 'mongodb_connector.js',
  //url: 'mongodb://localhost',
  //port: '27017',

  database: 'development',

  // For the sqlite3 connector. Unless a filename is defined, an in-memory
  // database is used. In-memory databases are not persisted, and will be lost
  // when the server is restarted.
  //filename: ':memory:' 
}
