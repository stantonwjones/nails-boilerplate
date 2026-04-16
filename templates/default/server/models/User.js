import {Model, DataTypes} from "@projectinvicta/nails";
import Dog from "./Dog.js";

export const schema = {
  name: DataTypes.STRING,
  verified: DataTypes.BOOLEAN,
  email: DataTypes.STRING,
}

export default class User extends Model {};

export async function afterInitialize() {
  // Add hooks here
}

export async function afterInitializeAll() {
  await User.hasMany(Dog);
}
