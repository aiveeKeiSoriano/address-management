const mongoose = require("mongoose")

const AddressSchema = new mongoose.Schema({
    city: {
        type: String,
        required: true,
    },
    pincode: {
        type: Number,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    addressLine1: {
        type: String,
        required: true,
    },
    addressLine2: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        required: true,
    }
})

const AddressModel = new mongoose.model('Address', AddressSchema)

module.exports = AddressModel