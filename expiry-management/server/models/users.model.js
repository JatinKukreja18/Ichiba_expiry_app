const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UsersSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    updatedOn: {
        type: Date
    }
});

UsersSchema.path('email').validate(async (value) => {
    const emailCount = await mongoose.models.users.countDocuments({email: value});
    let emailRegex = new RegExp("/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/");
    return !emailCount && emailRegex.test(value);
}, 'Invalid or Duplicate email id');

UsersSchema.path('phone').validate(async (value) => {
    const phoneCount = await mongoose.models.users.countDocuments({phone: value});
    let mobileNumberRegex = new RegExp('^([0|\+[0-9]{1,5})([7-9][0-9]{9})$')
    return !phoneCount && mobileNumberRegex.test(value);
}, 'Invalid or Duplicate phone number');


module.exports = mongoose.model('users', UsersSchema);