import hapiTest from "hapi-test";
import {it, after} from "mocha";
import server from "server";
import JWT from "jsonwebtoken";
import config from "config";


it("Should not access user details without access token", function (done) {
  hapiTest({server: server})
    .get("/v1/user")
    .assert(401, done);
});

it("Should return a valid JWT token", function (done) {
  hapiTest({server: server})
    .post("/v1/user/login", {id: 1})
    .then(response => {

      const decoded = (JWT.verify(response.result.token, config.jwt.secret));
      if (response.statusCode === 200 && decoded.id === 1) {
        // Done without params is success
        done();
      } else {
        // Done with error is failed test case
        done(new Error("Invalid user details"));
      }

    }).catch(err => {
      // Done with error is failed test case
      done(err);
    });
});
it("Should do something good");

/**
 * Close server after testing is done
 */
after(done => {
  server.stop(done);
});