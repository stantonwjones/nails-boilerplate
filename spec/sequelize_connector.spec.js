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
let TestSequelizeIndexedModel = null;

const TEST_OPTIONS = {
  schema: {
    label: DataTypes.STRING,
    value: DataTypes.STRING,
  },
  options: {
    indexes: [
      {
        unique: true,
        fields: ['label', 'value'],
      },
    ],
  },
};

describe('ModelV2 using SequelizeConnector', function() {
  let util;
  beforeEach(async function() {
    util = new SequelizeConnectorUtil();
    const connector = await util.getTestConnector();
    Model.setConnector(connector);
    TestSequelizeModel =
        class TestSequelizeModel extends new Model("TestSequelizeModel", TEST_SCHEMA) {};
    TestSequelizeIndexedModel =
        class TestSequelizeIndexedModel extends new Model("TestSequelizeIndexedModel", TEST_OPTIONS) {};
    await connector.sequelize.sync({ force: true });
  });

  it("Should be able to create, save, and retrieve a model", async function() {
    const MODEL_NAME = "First test model created";
    const testModel = TestSequelizeModel.build({name: MODEL_NAME});
    await testModel.save();
    const models = await TestSequelizeModel.findAll();
    assert(models.length == 1, "Should have one model");
    assert(models[0].name == MODEL_NAME, "Name should be consistent");
    assert(models[0] instanceof TestSequelizeModel);
  });

  it("Should be able to create, save, and retrieve a complex model", async function() {
    const MODEL_LABEL = "First test model LABEL";
    const MODEL_VALUE = "First test model VALUE";
    const testModel = await TestSequelizeIndexedModel.create({label: MODEL_LABEL, value: MODEL_VALUE});
    const models = await TestSequelizeIndexedModel.findAll();
    assert(models.length == 1, "Should have one model");
    assert(models[0].label == MODEL_LABEL, "label should be persisted");
    assert(models[0].value == MODEL_VALUE, "value should be persisted");
    assert(models[0] instanceof TestSequelizeIndexedModel);
  });

  it("Should be able to respect unique indexes", async function() {
    const MODEL_LABEL_0 = "MODEL_LABEL_0";
    const MODEL_VALUE_0 = "MODEL_VALUE_0";
    const MODEL_LABEL_1 = "MODEL_LABEL_1";
    const MODEL_VALUE_1 = "MODEL_VALUE_1";
    const testModels = await TestSequelizeIndexedModel.bulkCreate(
      [
        {label: MODEL_LABEL_0, value: MODEL_VALUE_0},
        {label: MODEL_LABEL_0, value: MODEL_VALUE_1},
        {label: MODEL_LABEL_1, value: MODEL_VALUE_0},
        {label: MODEL_LABEL_1, value: MODEL_VALUE_1},
      ]
    );
    assert(testModels.length == 4, "Should creaete 4 models");
    let indexWasRespected = true;
    try {
      await TestSequelizeIndexedModel.create({label: MODEL_LABEL_0, value: MODEL_VALUE_0});
      indexWasRespected = false;
    } catch(e) {
      console.log("Error was thrown as expected");
    }
    assert(indexWasRespected, "Should have thrown an error")
  });
});