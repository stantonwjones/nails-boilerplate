import nails from '../../../../../index.js';
const dogSchema = {
  good: Boolean,
  name: String
};
export default class Dog extends new nails.Model("Dog", {schema: dogSchema}) {};
