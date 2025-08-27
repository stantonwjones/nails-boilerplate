// const mongoose = require('mongoose');
// const {MongoMemoryServer} = require('mongodb-memory-server');
import { MongoMemoryServer } from 'mongodb-memory-server';
import MongooseDbConnector from './mongoose_connector.js';
// const MongooseDbConnector = require('./mongoose_connector');

export default class MongooseMemoryConnector extends MongooseDbConnector {

  async connect() {
    try {
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      console.error("The URI", uri);
      const dbConfig = {uri: uri};
      return super.connect(dbConfig);
    } catch (e) {
      console.error("Could not connect to MongoMemoryServer");
      console.error(e);
    }
  }
}