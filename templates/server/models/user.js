import nails from "nails-boilerplate";
const Model = nails.Model;

const userSchema = {
  name: String,
  verified: Boolean,
  email: String
};
export default class User extends new Model("User", {schema: userSchema}) {};
