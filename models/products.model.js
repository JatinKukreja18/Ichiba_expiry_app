
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let ProductsSchema = new Schema({
    SKU: {
        type: String,
        required: true, 
    },
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    expiry: {
        type: Date
    },
    notifyBefore: {
        type: Number
    },
    updatedOn: {
        type: Date
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

ProductsSchema.path('SKU').validate(async (value) => {
    const SKUCount = await mongoose.models.products.countDocuments({SKU: value });
    return !SKUCount;
}, 'SKU already exists');

ProductsSchema.path('name').validate(async (value) => {
    const nameCount = await mongoose.models.products.countDocuments({name: value });
    return !nameCount;
}, 'Name already exists');

ProductsSchema.path('expiry').validate((value) => {
    const expiryDate = new Date(value);
    return expiryDate.getTime() > new Date().getTime() + (7 * 24 * 60 * 60 * 1000)
}, 'Expiry date should be more than 7 days');

module.exports = mongoose.model('products', ProductsSchema);