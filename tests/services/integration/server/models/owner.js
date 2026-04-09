import {Model} from '../../../../../index.js';
import { DataTypes } from 'sequelize';
import Dog from './dog.js';

export const schema = {
  name: DataTypes.STRING,
};
export default class Owner extends Model {};

export async function defer() {
  Owner.hasMany(Dog);
}