import {Model, DataTypes} from "@projectinvicta/nails";

export const schema = {
  good: DataTypes.BOOLEAN,
  name: DataTypes.STRING,
};

export default class Dog extends Model {};
