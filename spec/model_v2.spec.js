import assert from 'assert';
import Model from '../lib/model_v2.js';
import MongooseConnectorUtil from './mongoose_connector.util.js';

const testSchema = {
  name: String,
  isTrue: Boolean,
  index: Number
}
let TestModel = null;


describe('ModelV2', function() {
  var util;
  beforeEach(async function() {
    util = new MongooseConnectorUtil();
    let connector = await util.getTestConnector();
    Model.setConnector(connector);
    TestModel =
        class Test extends new Model(
            "" + Math.random(), {schema: testSchema}) {
              whatsMyName() {return this.name};
            };
  });
  afterEach(async function() {
    await util.cleanup();
  });
  describe('Mongoose Model Inheritance', function() {
    const testAttr = {
      name: "testname",
      isTrue: false,
      index: 7
    };
    it("should be able to create a model", async function() {
      const testModel = new TestModel(testAttr);
      assert(testModel.name == testAttr.name);
      assert(testModel.isTrue == testAttr.isTrue);
      assert(testModel.index == testAttr.index);
      await testModel.save();
      console.log("The ID is:", testModel._id);
    })
    it("should be able to update a model", function() {
      const testModel = new TestModel(testAttr);
      const newName = "newName";
      return testModel.save().then(savedModel => {
        savedModel.name = newName;
        return savedModel.save();
      }).then(secondSavedModel => {
        assert(secondSavedModel.name == newName);
        assert(secondSavedModel._id == testModel._id);
      });
    });
    it("should be able to delete a model", async function() {
      const testModel = new TestModel(testAttr);
      await testModel.save();
      await TestModel.deleteOne({_id: testModel._id});
      assert.equal(await TestModel.findById(testModel._id), null);
    })
    it("should be able to find a model by id", async function() {
      const testModel = new TestModel(testAttr);
      await testModel.save();
      const foundModel = await TestModel.findById(testModel._id);
      assert(testModel._id.toString() == foundModel._id.toString());
      assert.equal(testModel.name, foundModel.name);
      assert.equal(testModel.isTrue, foundModel.isTrue);
      assert.equal(testModel.index, foundModel.index);
    });
    it("should preserve instance methods", async function() {
      const testModel = new TestModel(testAttr);
      await testModel.save();
      const foundModel = await TestModel.findById(testModel._id);
      assert.equal(foundModel.whatsMyName(), testModel.name);
    });
  });
})
