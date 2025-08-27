import nails from "../../../../../index.js";
import Dog from "../models/dog.js";

export default class ModeltestController extends nails.Controller {
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
