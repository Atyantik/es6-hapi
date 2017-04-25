import _ from "lodash";

const manageError = (error, reply) => {
  let errorCode = 500;
  let message = `Error while completing request: ${JSON.stringify(error.stack)}`;

  if (_.isError(error)) {
    errorCode = error.code || errorCode;
    message = error.message || message;
  }

  // Try to json decode error
  let decodedMessage;
  try {
    decodedMessage = JSON.parse(message);
  } catch (ex) {
    decodedMessage = message;
  }

  if (_.isString(decodedMessage)) {
    decodedMessage = {
      message: decodedMessage
    };
  }

  let response = reply(decodedMessage);
  response.code(errorCode);
};

export const configureHandlers = (routes) => {

  let finalRoutes = [];
  if (!_.isArray(routes)) {
    routes = [routes];
  }

  /**
   * Traverse each route to check if handler is present or not
   * if not then configure a handler based on provided controller & action
   */
  _.each(routes, route => {

    // Check for handler in root or config
    if (
      !_.isFunction(_.get(route, "handler", false)) &&
      !_.isFunction(_.get(route, "config.handler", false))
    ) {

      // Check for controller & action
      const controller = _.get(route, "controller", false);
      const action = _.get(route, "action", "index");

      // If not controller is present then its a problem
      if (!controller) {
        throw new Error("You need to either specify controller/action for the route or add a handler method", route);
      }

      // Set handler for routes
      _.set(route, "config.handler", (request, reply) => {

        // When a reply is used with the controller action itself, do not use it
        // again
        let isCustomReply = false;

        // Create a custom reply for every request
        const customReply = (...args) => {
          isCustomReply = true;
          return reply(...args);
        };

        // Try executing the controller's action
        try {
          // Create a new controller instance for the task
          const controllerInstance = new controller();
          if (!_.isFunction(controllerInstance[action])) {
            // If the action does not exists then throw appropriate error
            throw new Error(`Cannot call method "${action}" of controller ${controllerInstance.constructor.name}`);
          }

          // Get response data from controllerInstance
          let responseData = controllerInstance[action](request, customReply);

          // If in any way controller used the reply method to return response then
          // check if reply was custom
          if (!isCustomReply) {

            // Check if its a promise. If its a promise then let it resolve
            if (
              _.isObject(responseData) &&
              _.isFunction(responseData["then"])
            ) {
              responseData.then(data => {
                reply(data);
              }).catch((...args) => {
                const [error] = args;
                manageError(error, reply);
              });
            } else {
              reply(responseData);
            }
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(error);
          manageError(error, reply);
        }
      });
    }

    try {
      delete route["controller"];
      delete route["action"];
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("Error deleting route: ", route);
      // eslint-disable-next-line no-console
      console.info(error);
    }
    finalRoutes.push(route);
  });

  return finalRoutes;

};