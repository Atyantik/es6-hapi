/**
 * @description This file is for registering babel register
 * thus including server file
 */
/* eslint-disable */
const fs = require("fs");
const path = require("path");

const babelrc = fs.readFileSync(__dirname + "/../.babelrc");
let config;

try {
  config = JSON.parse(babelrc);
} catch (err) {
  console.error("==> ERROR: Error parsing your .babelrc.");
  console.error(err);
}

require("babel-register")(config);
require("babel-polyfill");

/**
 * try to include src to path, but with last priority
 */
try {
  const extraIncludePaths = require('../webpack.config.babel').includePaths || [];
  process.env.NODE_PATH = `${process.env.NODE_PATH}:${extraIncludePaths.join(":")}`;
  require('module').Module._initPaths();
} catch (ex) {}

if (process.argv.length > 2) {
  const pathToFile = process.argv[2];
  const resolvedFile = path.resolve(`${pathToFile}`);
  if (fs.existsSync(resolvedFile)) {
    require(resolvedFile);
  }
} else {
  console.log("Babelize is only helpful when provided with a file name");
  console.log("Usage: nodejs babelify.js <path to file>");
  console.log("Example: nodejs babelify.js ./dev.server.js");
}
/* eslint-enable */
