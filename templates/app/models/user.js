const Model = require("nails-boilerplate").Model;
const userSchema = {
  name: String,
  verified: Boolean,
  email: String
};
module.exports = class User extends new Model("User", {schema: userSchema}) {};
