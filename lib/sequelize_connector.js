import DbConnector from './database_connector.js';
import { Sequelize, Model } from 'sequelize';

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

  /**
   * @returns {Model}
   */
  generateModelSuperclass(name, options) {
    if (options.schema) {
      return this.sequelize.define(name, options.schema, options.options);
    }
    return this.sequelize.define(name, options);
  }

  async afterInitialization() {
    console.log("SEQUELIZE::Writing changes to SQL Database");
    await this.sequelize.sync({alter: {drop: false}});
  }
}