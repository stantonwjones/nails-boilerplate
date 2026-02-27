import {Model} from '../../../../../index.ts';
import { DataTypes } from 'sequelize';
import Dog from './dog.js';

export const schema = {
  name: DataTypes.STRING,
};
export default class Owner extends Model {};

export async function defer() {
  Owner.hasMany(Dog);
  await Dog.sync({alter: {drop: false}});
}