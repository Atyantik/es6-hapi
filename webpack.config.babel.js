/**
 * @author: Atyantik Technologies Private Limited
 */
import webpack from "webpack";
import path from "path";
import UglifyJSPlugin from "uglifyjs-webpack-plugin";
import CleanWebpackPlugin from "clean-webpack-plugin";

/**
 * @description Public directory name preferred during
 * application building and in src folder
 * @type {string}
 */
const publicDirName = "public";

/**
 * @description Distribution directory name where all the code will
 * be available after a build is run
 * @type {string}
 */
const distDirName = "dist";

/**
 * @description the source of all the files
 * This directory contains app, client, server, routes, configs
 * @type {string}
 */
const srcDirName = "src";


// Directory structure
// Root dir is the project root
export const rootDir = path.resolve(__dirname);

// Distribution dir is the directory where
// We will put all the output dir
export const distDir = path.resolve(path.join(rootDir, distDirName));

// Src dir is the source of all the files, including server,
// api, client etc
export const srcDir = path.resolve(path.join(rootDir, srcDirName));

// Public directory where all the assets are stored
export const srcPublicDir = path.resolve(path.join(srcDir, publicDirName));

export const distPublicDir = path.join(distDir, publicDirName);

export const includePaths = [
  path.join(srcDir)
];

export default {

  // The base directory, an absolute path, for resolving entry points
  // and loaders from configuration. Lets keep it to /src
  context: srcDir,

  // The point or points to enter the application. At this point the
  // application starts executing. If an array is passed all items will
  // be executed.
  entry: [
    "babel-polyfill",
    path.join(srcDir, "server.js"),
  ],

  //These options determine how the different types of modules within
  // a project will be treated.
  module: {
    rules: [
      // Rules for js or jsx files. Use the babel loader.
      // Other babel configuration can be found in .babelrc
      {
        test: /\.jsx?$/,
        include: srcDir,
        use: [
          {
            loader: "babel-loader",
          }
        ]
      },
      {
        test: /\.html$/,
        use: [{
          loader: "html-loader",
          options: {
            minimize: true
          }
        }],
      },
      {test: /\.json$/, loader: "json-loader"},
      {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff"},
      {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff"},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=application/octet-stream"},
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader"},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=image/svg+xml"}
    ],
  },
  output: {

    // Output everything in dist folder
    path: distDir,

    // The file name to output
    filename: "server.js",

    // public path is assets path
    publicPath: "/",
  },

  resolve: {
    alias: {
      "handlebars": "handlebars/dist/handlebars.js"
    },
    modules: [
      "node_modules",
      ...includePaths
    ],
  },
  target: "node",
  plugins: [

    // While building remove the dist dir
    new CleanWebpackPlugin(["dist"], {
      root: rootDir,
      verbose: true,
    }),

    // Enable no errors plugin
    new webpack.NoEmitOnErrorsPlugin(),

    // Uglify the output so that we have the most optimized code
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new UglifyJSPlugin({
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true
      },
      compress: {
        screw_ie8: true
      },
      comments: false
    }),

    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    })
  ],
};