const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    addresses: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "Address",
        default: []
    },
    refresh: {
        type: String
    }
}, { timestamps: true })

const UserModel = new mongoose.model('User', UserSchema)

module.exports = UserModel