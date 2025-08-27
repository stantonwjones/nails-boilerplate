import MongooseMemoryConnector from '../lib/mongoose_mem_connector.js';
import mongoose from 'mongoose';

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

export default MongooseConnectorUtil;
