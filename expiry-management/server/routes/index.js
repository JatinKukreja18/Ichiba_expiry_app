const express = require("express");

module.exports = (app) => {
    app.use(express.json());
    
    // Routes for products
    app.use('/api/products', require('../controllers/products.controller'));

    // Routes for expiry
    app.use('/api/expiry/', require('../controllers/products-expiry.controller'));

    // Routes for users
    app.use('/api/users', require('../controllers/users.controller'));

}