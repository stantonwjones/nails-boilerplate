import SequelizeConnector from '../lib/sequelize_connector.js';

class SequelizeConnectorUtil {
  constructor() {
  }

  async getTestConnector() {
    const dbConnector = new SequelizeConnector();
    this.connection = await dbConnector.connect({address: 'sqlite::memory:'});
    debugger;
    return dbConnector;
  }
  async cleanup() {
    debugger;
  }
}

export default SequelizeConnectorUtil;
