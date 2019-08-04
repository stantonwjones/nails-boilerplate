let dbConnector = null;

class Model {
  static setConnector(connector) {
    if (!dbConnector) dbConnector = connector;
  }

  constructor(modelName, connectorOptions) {
    return dbConnector.generateModelSuperclass(modelName, connectorOptions);
  }
}

module.exports = Model;
