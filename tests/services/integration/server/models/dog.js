import {Model, DataTypes} from '../../../../../index.js';
import Owner from './owner.js';

export const schema = {
  good: DataTypes.BOOLEAN,
  name: DataTypes.STRING,
};

export default class Dog extends Model {};

export async function finalize() {
  Dog.belongsTo(Owner);
}
