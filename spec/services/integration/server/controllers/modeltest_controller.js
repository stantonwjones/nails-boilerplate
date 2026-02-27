import nails from "../../../../../index.ts";
import Dog from "../models/dog.js";

export default class ModeltestController extends nails.Controller {
  async createdog(params, request, response) {
    let dog = await Dog.create({good: true, name: params.name});
    console.log("CREATED DOG ID:", dog.id);
    return dog.id.toString();
  }

  async getdogbyid(params, request, response) {
    console.error("DOG ID IS:", params.id);
    return await Dog.findByPk(params.id);
  }
}
