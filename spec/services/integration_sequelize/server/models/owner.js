import nails from '../../../../../index.js';
import { DataTypes } from 'sequelize';
import Dog from './dog.js';
const ownerSchema = {
  name: DataTypes.STRING,
};
class Owner extends new nails.Model("Owner", ownerSchema) {};
Owner.hasMany(Dog);
await Dog.sync();
export default Owner;