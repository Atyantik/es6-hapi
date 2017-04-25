import UserController from "../v1/User/UserController";
import Joi from "joi";

export default [
  {
    method: "POST",
    path: "/v1/user/login",
    controller: UserController,
    action: "login",
    config: {
      validate: {
        payload: {
          id: Joi.number().integer().required()
        }
      },
      auth: false,
      description: "Login user and return a JWT token",
      notes: "Accept username & password in post, right now we are just requesting id, Just for" +
      " tutoring purpose.",
      tags: ["api"]
    },
  },
  {
    method: "GET",
    path: "/v1/user/{id}",
    controller: UserController,
    action: "getUser",
    config: {
      validate: {
        params: {
          id: Joi.number().integer().required()
        }
      },
      description: "Get user by user id",
      notes: "Return user details with user id",
      tags: ["api"]
    },
  },
  {
    method: "GET",
    path: "/v1/user",
    controller: UserController,
    action: "getUser",
    config: {
      description: "Get paginated list of all users",
      notes: "Returns list of all users",
      tags: ["api"]
    },
  }
];
