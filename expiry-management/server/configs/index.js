/**
 * Universal configuration file
 */

// Dependencies
const path = require('path');
const _ = require('lodash');

// Common configuration for all environment
const all = {
    env: process.env.NODE_ENV,

    root: path.normalize(__dirname + "/../")
}

// Export the configuration file
module.exports = _.merge(all, require('./' + process.env.NODE_ENV + '.js') || {});