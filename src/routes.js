import v1Routes from "./app/v1/routes";

import { configureHandlers } from "./utils/router";

export default configureHandlers([
  ...v1Routes
]);