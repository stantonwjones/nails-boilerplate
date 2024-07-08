// const mongoose = require('mongoose');
const {MongoMemoryServer} = require('mongodb-memory-server');

const MongooseDbConnector = require('./mongoose_connector');

class MongooseMemoryConnector extends MongooseDbConnector {

  async connect() {
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    console.error("The URI", uri);
    const dbConfig = {uri: uri};
    return super.connect(dbConfig);
  }
}
module.exports = MongooseMemoryConnector;