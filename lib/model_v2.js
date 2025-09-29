let dbConnector = null;

export default class Model {
  static setConnector(connector) {
    // TODO: enforce environment using variables
    if (dbConnector)
      console.warn("WARNING: Model#setConnector should not be called multiple times outside of tests");
    dbConnector = connector;
  }

  constructor(modelName, connectorOptions) {
    return dbConnector.generateModelSuperclass(modelName, connectorOptions);
  }
}
