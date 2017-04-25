import _ from "lodash";
import CoreModel from "app/CoreModel";
const dummyData = [
  {
    id: 1,
    name: "Tirth Bodawala",
  },
  {
    id: 2,
    name: "Ajay Patel",
  },
  {
    id: 3,
    name: "Nandish Ajani",
  }
];

export default class User extends CoreModel{

  static async find(id = 0) {
    return Promise.resolve(_.find(dummyData, {id: id}));
  }

  static async all() {
    return Promise.resolve(_.clone(dummyData));
  }
}