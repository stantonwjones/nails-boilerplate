const MongooseConnector = require('../lib/mongoose_connector.js');
const {MongoMemoryServer} = require('mongodb-memory-server');

class MongooseConnectorUtil {
  constructor() {
    this.mongod = new MongoMemoryServer();
  }

  async getTestConnector() {
    const uri = await this.mongod.getConnectionString();
    const port = await this.mongod.getPort();
    const dbPath = await this.mongod.getDbPath();
    const dbName = await this.mongod.getDbName();
    const dbConfig =
        {uri: uri, port: port, database: dbName, dbPath: dbPath};
    MongooseConnector.connect(dbConfig);
    return MongooseConnector;
  }
  cleanup() {
    return this.mongod.stop();
  }
}

module.exports = MongooseConnectorUtil;
