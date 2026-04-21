let DB_ADDRESS = process.env.NAILS_SQLITE_DB_FILE;
if (!DB_ADDRESS) DB_ADDRESS = 'sqlite://' + import.meta.dirname + '/development.db';

export default {
  /** Mongoose Connector */
  // connector: 'mongoose_connector.js',
  // url: 'mongodb://localhost',
  // port: '27017',

  /** Mongoose Memory Server Connector */
  // connector: 'mongoose_mem_connector.js',
  // database: 'development',

  /** Sequelize Connector */
  connector: 'sequelize_connector.js',
  address: process.env.NAILS_RELEASE_STAGE == 'test'
    ? 'sqlite::memory:'
    : DB_ADDRESS,
}
