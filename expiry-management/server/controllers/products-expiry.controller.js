const express = require("express");
const router = express.Router();
const Expiry = require("../models/expiry.model");
const Products = require("../models/products.model");
const Users = require("../models/users.model");
const Mail = require("../utils/mail.utils");

router.get('/', async (req, res) => {
    try {
        let dbQueryFilter = {};
        dbQueryFilter.fields = null;
        dbQueryFilter.query = {};
        dbQueryFilter.options = {};
        dbQueryFilter.options.limit = 50;
        if (req.query && req.query['page'] && req.query['page'] > 0) {
            dbQueryFilter.options.skip = dbQueryFilter.options.limit * req.query['page'];
        }
        dbQueryFilter.query.isHandeled = {$ne: true};
        // dbQueryFilter.query['product._id'] = req.params['productId'];
        dbQueryFilter.query['expiry'] = { $lte: new Date(new Date().getTime() + (45 * 24 * 60 * 60 * 1000)), $gte: new Date()}
        let expiries = await Expiry.find(dbQueryFilter.query, dbQueryFilter.fields, dbQueryFilter.options);
        res.status(200).send({message: "Expiry products fetched Successfully!", data: expiries});
    } catch (error) {
        res.status(500).send({message: "Expiry products not found", data: null});
    }
});

router.get('/sync', async (req, res) => {
    try {
        let dbQueryFilter = {};
        dbQueryFilter.fields = null;
        dbQueryFilter.query = {};
        dbQueryFilter.options = {};
        dbQueryFilter.options.limit = 50;
        if (req.query && req.query['page'] && req.query['page'] > 0) {
            dbQueryFilter.options.skip = dbQueryFilter.options.limit * req.query['page'];
        }
        dbQueryFilter.query.isHandeled = {$ne: true};
        // dbQueryFilter.query['product._id'] = req.params['productId'];
        dbQueryFilter.query['expiry'] = { $lte: new Date(new Date().getTime() + (45 * 24 * 60 * 60 * 1000)), $gte: new Date()}
        let expiries = await Expiry.find(dbQueryFilter.query, dbQueryFilter.fields, dbQueryFilter.options).exec();
        let users = await Users.find({isDeleted: {$ne: true}});
        console.log("Expiring soon Products: ", Expiry);
        console.log("Users: ", users);
        await Mail.sendEmail('piyushmth16@gmail.com', 'from', 'Test Email', 'Test Subject');
        res.status(200).send({message: "Expiry products fetched Successfully!", data: expiries});
    } catch (error) {
        res.status(500).send({message: "Expiry products not fetched!", data: null});
    }
});

router.post('/:productId', async (req, res) => {
    try {
        if (req.params && 
            req.params['productId'] && 
            req.body && 
            req.body.expiry &&
            req.body.quantity
        ){
            let product = await Products.findOne({_id: req.params['productId']});
            if (product) {
                let newExpiry = new Expiry();
                newExpiry.expiry = req.body.expiry;
                newExpiry.quantity = req.body.quantity;
                Object.assign(newExpiry, {product: product});
                await newExpiry.save();
                res.status(200).send({message: "New Expiry created", data: null});
            } else {
                res.status(400).send({message: "Product not found.", data: null})
            }
        } else {
            res.status(400).send({message: "Product not found.", data: null})
        }
    } catch (error) {
        res.status(400).send({message: "Product not found.", data: null})
    }
});

router.put('/:id', async (req, res) => {
    try {
        if (req.params &&
            req.params['id'] &&
            req.body &&
            (req.body['expiry'] || req.body['quantity'])
        ) {
            let updatedObj = await Expiry.findByIdAndUpdate(req.params['id'], req.body, {new: true, runValidators: true});
            res.status(200).send({message: "Expiry updated successfully!", data: updatedObj});
        } else {
            res.status(400).send({message: "Expiry not updated!", data: null});
        }
    } catch (error) {
        res.status(500).send({message: "Expiry not updated!", data: null});
    }
});

router.delete('/:id', async(req, res) => {
    try {
        if (req.params &&
            req.params['id']
        ) {
            let updatedObj = await Expiry.findByIdAndUpdate(req.params['id'], { $set: {isHandeled: true}}, {new: true, runValidators: true});
            res.status(200).send({message: "Expiry updated successfully!", data: updatedObj});
        } else {
            res.status(400).send({message: "Expiry not updated!", data: null});
        }
    } catch (error) {
        res.status(500).send({message: "Expiry not updated!", data: null});
    }
});


module.exports = router;