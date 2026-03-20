import {Model, DataTypes} from '../../../../../index.ts';

export const schema = {
  good: DataTypes.BOOLEAN,
  name: DataTypes.STRING,
};

export default class Dog extends Model {};
