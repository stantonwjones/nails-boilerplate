import nails from '../../../../../index.js';
import { DataTypes } from 'sequelize';
const dogSchema = {
  good: DataTypes.BOOLEAN,
  name: DataTypes.STRING,
};
export default class Dog extends new nails.Model("Dog", dogSchema) {};
