// import SequelizeConnector from '../lib/sequelize_connector.js';
import assert from 'assert';
import Model from '../lib/model_v2.js';
import { DataTypes } from 'sequelize';
import SequelizeConnectorUtil from './sequelize_connector.util.js';

const TEST_SCHEMA = {
  name: DataTypes.STRING,
  favoriteColor: {
    type: DataTypes.STRING,
    defaultValue: 'green',
  },
  age: DataTypes.INTEGER,
  cash: DataTypes.INTEGER,
}
let TestSequelizeModel = null;

describe('ModelV2 using SequelizeConnector', function() {
  let util;
  beforeEach(async function() {
    util = new SequelizeConnectorUtil();
    const connector = await util.getTestConnector();
    Model.setConnector(connector);
    TestSequelizeModel =
        class TestSequelizeModel extends new Model("TestSequelizeModel", TEST_SCHEMA) {
        };
    await connector.sequelize.sync({ force: true });
  });

  it("Should be able to create, save, and retrieve a model", async function() {
    const MODEL_NAME = "First test model created";
    const testModel = TestSequelizeModel.build({name: MODEL_NAME});
    await testModel.save();
    const models = await TestSequelizeModel.findAll();
    assert(models.length == 1, "Should have one model");
    assert(models[0].name == MODEL_NAME, "Name should be consistent");
  });
});