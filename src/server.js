import Hapi from "hapi";
import Inert from "inert";
import Vision from "vision";
import HapiSwagger from "hapi-swagger";
import JwtAuth from "hapi-auth-jwt2";
import _ from "lodash";
import User from "app/models/User";

// Getting config for application
import config from "config";

// Getting combined routes for application
import Routes from "routes";

export const server = new Hapi.Server();

server.connection({
  host: _.get(config, "server.host", "localhost"),
  port: _.get(config, "server.port", 8080),
});

const swaggerOptions = _.get(config, "documentation", {});

const plugins = [
  Inert,
  Vision,
  JwtAuth,
  {
    "register": HapiSwagger,
    "options": swaggerOptions
  }
];

server.route(Routes);

// bring your own validation function
const validate = function (decoded, request, callback) {

  // do your checks to see if the person is valid
  User.find(decoded.id).then(() => {
    callback(null, true);
  }).catch(() => {
    callback(null, false);
  });
};

server.register(plugins, (err) => {

  if (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    process.exit(1);
    return;
  }

  /**
   * Set auth parameters
   */
  server.auth.strategy("jwt", "jwt",
    {
      key: _.get(config, "jwt.secret", "TrU5Tr183"), // Never Share your secret key
      validateFunc: validate, // validate function defined above
      verifyOptions: {algorithms: ["HS256"]} // pick a strong algorithm
    });

  server.auth.default("jwt");

  server.start((err) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    } else {
      // eslint-disable-next-line no-console
      console.log("☕ Server running at:", server.info.uri);
    }
  });
});

export default server;