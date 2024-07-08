const MongooseMemoryConnector = require('../lib/mongoose_mem_connector.js');
const mongoose = require('mongoose');

class MongooseConnectorUtil {
  constructor() {
    this.mongoose = mongoose;
  }

  async getTestConnector() {
    const dbConnector = new MongooseMemoryConnector();
    this.connection = await dbConnector.connect();
    debugger;
    return dbConnector;
  }
  async cleanup() {
    debugger;
  }
}

module.exports = MongooseConnectorUtil;
