const MongoDBConnector = require('../lib/mongodb_connector.js');
const {MongoMemoryServer} = require('mongodb-memory-server');

class MongoDBConnectorUtil {
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
    //console.log(JSON.stringify(dbConfig));
    return new MongoDBConnector(dbConfig);
  }
  cleanup() {
    return this.mongod.stop();
  }
}

module.exports = MongoDBConnectorUtil;
