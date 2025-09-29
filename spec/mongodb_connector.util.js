import MongooseConnector from '../lib/mongoose_connector.js';
import {MongoMemoryServer} from 'mongodb-memory-server';

let singularInstanceCreated = false;
let promisedMongod = null;

class MongoDBConnectorUtil {
  constructor() {
    promisedMongod = MongoMemoryServer.create();
    singularInstanceCreated = true;
  }

  async getTestConnector() {
    this.mongod = await promisedMongod;
    const uri = this.mongod.getUri();
    const port = this.mongod.instanceInfo.port;
    const dbPath = this.mongod.instanceInfo.dbPath;
    const dbName = this.mongod.instanceInfo.dbName;
    const dbConfig =
        {uri: uri, port: port, database: dbName, dbPath: dbPath};
    //console.log(JSON.stringify(dbConfig));
    return new MongooseConnector(dbConfig);
  }

  async cleanup() {
    await this.mongod.stop();
  }
}

export default MongoDBConnectorUtil;
