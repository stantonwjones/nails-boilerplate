import DbConnector from './database_connector.js';
import { Sequelize } from 'sequelize';
// const { Sequelize } = require('sequelize');

export default class SequelizeConnector extends DbConnector {
  sequelize;

  async connect(options) {
    this.sequelize = new Sequelize(options.address);
    try {
      await this.sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }

  generateModelSuperclass(name, options) {
    return this.sequelize.define(name, options);
  }

  async afterInitialization() {
    console.log("SEQUELIZE::Writing changes to SQL Database");
    await this.sequelize.sync();
  }
}