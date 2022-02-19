const MongooseConnector = require('../lib/mongoose_connector.js');
const {MongoMemoryServer} = require('mongodb-memory-server');
const mongoose = require('mongoose');

let promisedMongod = null;

class MongooseConnectorUtil {
  constructor() {
    this.mongoose = mongoose;
    promisedMongod = MongoMemoryServer.create();
  }

  async getTestConnector() {
    this.mongod = await promisedMongod;
    const uri = this.mongod.getUri();
    const port = this.mongod.instanceInfo.port;
    const dbPath = this.mongod.instanceInfo.dbPath;
    const dbName = this.mongod.instanceInfo.dbName;
    const dbConfig = {uri: uri};
        //{uri: uri, port: port, database: dbName, dbPath: dbPath};
    const dbConnector = new MongooseConnector();
    this.connection = await dbConnector.connect(dbConfig);
    debugger;
    return dbConnector;
  }
  async cleanup() {
    //await this.mongod.stop();
    //await this.connection.close();
    debugger;
  }
}

module.exports = MongooseConnectorUtil;
