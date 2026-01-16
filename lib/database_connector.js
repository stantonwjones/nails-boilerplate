export default class DbConnector {
  async connect() {
    throw 'DbConnector#connect not implemented'
  }
  generateModelSuperclass() {
    throw 'GenerateModelSuperclass not implemented'
  }
  
  async afterInitialization() {
    console.warn("DbConnector#afterInitialization not implemented");
  }
}