/**
 * Primary file for Application
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Dependencies
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('./configs');

// Connect with mongoDB instance here
mongoose.connect(config.mongo.uri, {useNewUrlParser: true});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("Connected to DB");
});

// Create a http server
const server = require('http').createServer(app);

// Initialize routes
require('./routes')(app);

// Start a http server
server.listen(config.port, config.ip, () => {
    console.info(`Server is running on IP: ${config.ip} and PORT: ${config.port}`);
});
