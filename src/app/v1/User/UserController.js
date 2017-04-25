import User from "app/models/User";
import _ from "lodash";
import CoreController from "app/CoreController";
import JWT from "jsonwebtoken";
import config from "config";

export default class UserController extends CoreController {

  constructor(...args) {
    super(...args);
  }
  async getUser(request) {
    if (request.params.id) {
      const userDetails = await User.find(request.params.id);
      if (_.isEmpty(userDetails)) {
        return Promise.reject(this.createError("No user found with matching criteria", 404));
      }
      return userDetails;
    }
    return await User.all();
  }
  async login(request) {
    const userDetails = await User.find(request.payload.id);
    if (userDetails) {
      return _.assignIn({
        token: JWT.sign(userDetails, _.get(config, "jwt.secret", "")),
      }, userDetails);
    }
    return Promise.reject(this.createError("Invalid credentials", 400));
  }
}