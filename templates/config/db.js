export default {
  /**
   * For the sqlite3 connector. Unless a filename is defined, an in-memory
   * database is used. In-memory databases are not persisted, and will be lost
   * when the server is restarted.
   */
  // connector: 'sqlite3_connector.js',
  // filename: ':memory:'

  /** Mongoose Connector */
  // connector: 'mongoose_connector.js',
  // url: 'mongodb://localhost',
  // port: '27017',

  /** Mongoose Memory Server Connector */
  // connector: 'mongoose_mem_connector.js',
  // database: 'development',

  /** Sequelize Connector */
  connector: 'sequelize_connector.js',
  address: 'sqlite::memory:',
}
