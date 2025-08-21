const Model = require("../../../../../index.js").Model;
const dogSchema = {
  good: Boolean,
  name: String
};
module.exports = class Dog extends new Model("Dog", {schema: dogSchema}) {};
