const Controller =
    require("../../../../../index.js").Controller;
const Dog = require("../models/dog.js");
module.exports = class ModeltestController extends Controller {
  async createdog(params, request, response) {
    let dog = new Dog({good: true, name: params.name});
    await dog.save();
    return dog._id.toString();
  }

  async getdogbyid(params, request, response) {
    let dog = await Dog.findById(params.id);
    return {
      name: dog.name,
      good: dog.good
    };
  }
}
