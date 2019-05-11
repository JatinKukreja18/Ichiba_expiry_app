
const express = require('express');
const router = express.Router();
const Products = require('../models/products.model');

/**
 * Get all Products
 */
router.get('/', async (req, res, next) => {
    try {
        let dbQueryFilter = {};
        dbQueryFilter.fields = null;
        dbQueryFilter.query = {};
        dbQueryFilter.options = {};
        dbQueryFilter.options.limit = 50;
        if (req.query && req.query['fields']) {
            dbQueryFilter.fields = req.query['fields'].split(',').join(' ');
        }
        if (req.query && req.query['page'] && req.query['page'] > 0) {
            dbQueryFilter.options.skip = dbQueryFilter.options.limit * req.query['page'];
        }
        dbQueryFilter.query.isDeleted = {$ne: true};
        let products = await Products.find(dbQueryFilter.query, dbQueryFilter.fields, dbQueryFilter.options);
        res.status(200).send({message: "Products fetched successfully!", data: products});
    } catch (error) {
        console.log("Error: ", Object.keys(error));
        res.status(500).send({message: "Internal Server Error", data: null});
    }
});

/**
 * Create a new product
 */
router.post('/', async (req, res, next) => {
    try {
        if (req.body && req.body.SKU && req.body.name && req.body.quantity) {
            let product = new Products(req.body);
            Object.assign(product, { updatedOn: new Date().getTime()});
            console.log("New Product: ", product);
            let newProduct = await product.save();
            res.status(200).send({message: "Product created successfully!!", data: newProduct});
        } else {
            res.status(400).send({message: "Product not created!!", data: null});
        }
    } catch (error) {
        console.log("Error", error);
        if (error && error.errors) {
            res.status(400).send({message: error.message, data: null});
        } else {
            res.status(500).send({message: "Internal Server Error", data: null});
        }
    }
});

/**
 * Update product
 * request param: product id
 */
router.put('/:id', async (req, res, next) => {
    try {
        if (req && req.params && req.params['id'] && req.body) {
            let updateObj = req.body;
            Object.assign(updateObj, {updatedOn: new Date()})
            let updatedObj = await Products.findByIdAndUpdate(req.params['id'], updateObj, {new: true, runValidators: true});
            res.status(200).send({message: 'Product updated', data: updatedObj});
        } else {
            res.status(400).send({message: 'Product not updated', data: null});
        }
    } catch (error) {
        res.status(500).send({message: "Internal Server Error", data: null});
    }
});

/**
 * Delete product
 * request params: product id
 */
router.delete('/:id', async (req, res) => {
    try {
        if (req && req.params && req.params['id']) {
            let updateObj = { isDeleted: true, updatedOn: new Date() };
            Object.assign(updateObj, {updatedOn: new Date()})
            await Products.findByIdAndUpdate(req.params['id'], updateObj);
            res.status(200).send({message: 'Product deleted', data: null});
        } else {
            res.status(400).send({message: 'Product not deleted', data: null});
        }
    } catch (error) {
        res.status(500).send({message: "Internal Server Error", data: null});
    }
});

router.get('/`')

module.exports = router;