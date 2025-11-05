import nails from "nails-boilerplate";
import { DataTypes } from 'sequelize';
const Model = nails.Model;

const sequelizeUserSchema = {
  name: DataTypes.STRING,
  verified: DataTypes.BOOLEAN,
  email: DataTypes.STRING
}
export default class User extends new Model("User", sequelizeUserSchema) {};

/** If using a mongoose connector */
// const mongooseUserSchema = {
//   name: String,
//   verified: Boolean,
//   email: String
// };
// export default class User extends new Model("User", {schema: mongooseUserSchema}) {};
