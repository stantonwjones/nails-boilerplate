import {Model, DataTypes} from "@projectinvicta/nails";
import Dog from "./Dog";

export const schema = {
  name: DataTypes.STRING,
  verified: DataTypes.BOOLEAN,
  email: DataTypes.STRING,
}

export default class User extends Model {};

export async function defer() {
  await User.hasMany(Dog);
}
