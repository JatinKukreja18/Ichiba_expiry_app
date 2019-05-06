
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let RefProductSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
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
    notifyBefore: {
        type: Number
    }
});

let ProductExpirySchema = new Schema({
    product: {
        type: RefProductSchema,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    expiry: {
        type: Date,
        required: true
    },
    isHandled: {
        type: Boolean,
        default: false
    }
});

ProductExpirySchema.path("expiry").validate(async value => {
    const expiryDate = new Date(value);
    return expiryDate.getTime() > new Date().getTime() + (7 * 24 * 60 * 60 * 1000)
}, "Expiry date should be more than 7 days");

module.exports = mongoose.model('product_expiry', ProductExpirySchema);

