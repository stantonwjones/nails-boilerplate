let dbConnector = null;

const FINALIZATIONS = [];

export default class Model {
  static finalize(extraWork) {
    FINALIZATIONS.push(extraWork);
  }

  static async _doFinalize() {
    await Promise.all(FINALIZATIONS.map(extraWork => extraWork()));
  }

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
