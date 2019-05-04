const express = require("express");

module.exports = (app) => {
    app.use(express.json());
    
    // Routes for products
    app.use('/api/products', require('../controllers/products.controller'));

    // Routes for users
    app.use('/api/users', require('../controllers/users.controller'));

}