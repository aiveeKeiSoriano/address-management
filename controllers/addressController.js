const mongoose = require("mongoose");
const Address = require("../models/address");
const User = require("../models/user");

const addAddress = async (email, address) => {
    let user = await User.findOne({ email })
    if (!user) return { status: false, result: { message: 'User not found' } }
    try {
        const newAddress = new Address(address)
        let savedAddress = await newAddress.save()
        user.addresses.push(savedAddress)
        await user.save()
        return { status: true, result: user.addresses }
    }
    catch(e) {
        return { status: false, result: { message: "Error" + e.message } }
    }
}

const deleteAddress = async (email, inputId) => {
    let id = mongoose.mongo.ObjectID(inputId)
    try {
        await User.updateOne({ email }, { $pull: { addresses: id } } )
        await Address.deleteOne({ _id: id })
        return { status: true, result: { message: "Deleted successfully" } }
    }
    catch(e) {
        return { status: false, result: { message: "Error " + e.message } }
    }
}

const allAddress = async (email, params) => {
    let user = await User.findOne({ email }).populate("addresses")
    let addresses = user.addresses.filter(address => {
        for (let field in params) {
            if (params[field].toLowerCase().includes(address[field].toLowerCase())) {
                return true
            }
            else return false
        }
        return true
    })
    return { status: true, result: addresses }
}

const updateAddress = async (inputId, info) => {
    let id = mongoose.mongo.ObjectID(inputId)
    try {
        await Address.updateOne({ _id: id }, { $set: { ...info } })
        return { status: true, result: { message: "Updated successfully" } }
    }
    catch(e) {
        return { status: false, result: { message: "Error " + e.message } }
    }
}

module.exports = {
    addAddress,
    deleteAddress,
    allAddress,
    updateAddress
}