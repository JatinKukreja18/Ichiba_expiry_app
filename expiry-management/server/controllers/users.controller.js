const express = require('express');
const router = express.Router();
const Users = require('../models/users.model');

/**
 * Get all Users
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
        let users = await Users.find(dbQueryFilter.query, dbQueryFilter.fields, dbQueryFilter.options);
        res.status(200).send({message: "Users fetched successfully!", data: users});
    } catch (error) {
        console.log("Error: ", Object.keys(error));
        res.status(500).send({message: "Users not found!", data: null});
    }
});

/**
 * Create a new product
 */
router.post('/', async (req, res, next) => {
    try {
        if (req.body && req.body.email && req.body.name && req.body.phone) {
            let user = new Users(req.body);
            Object.assign(user, { updatedOn: new Date().getTime()});
            await user.save();
            res.status(200).send({message: "Users created successfully!", data: null});
        } else {
            res.status(400).send(null);
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
            let updatedObj = await Users.findByIdAndUpdate(req.params['id'], updateObj);
            res.status(200).send({message: 'User updated', data: updatedObj});
        } else {
            res.status(400).send({message: 'User not updated', data: null});
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
            await Users.findByIdAndUpdate(req.params['id'], updateObj);
            res.status(200).send({message: 'User deleted', data: null});
        } else {
            res.status(400).send({message: 'User not deleted', data: null});
        }
    } catch (error) {
        res.status(500).send({message: "Internal Server Error", data: null});
    }
})

module.exports = router;