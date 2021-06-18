const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require('bcrypt')

const addUser = async ({ name, email, password }) => {
    let emailRegex = /.+@.+[.].+/
    if (!emailRegex.test(email)) {
        return { status: false, result: { message: 'Invalid Email ID' } }
    }
    if (!name) return { status: false, result: { message: 'Name is required' } }
    if (!password) return { status: false, result: { message: 'Password is required' } }

    let hash = await bcrypt.hash(password, 10)
    
    try {
        const newUser = new User({ name, email, password: hash })
        let savedUser = await newUser.save()
        return { status: true, result: savedUser}
    }
    catch(e) {
        return { status: false, result: { message: "Error" + e.message } }
    }
}

const findUser = async ({ email, password }) => {
    let user = await User.findOne({ email })
    if (!user) return { status: false, result: { message: 'User not found' } }
    if (await bcrypt.compare(password, user.password)) {
        return { status: true, result: user}
    }
    else return { status: false, result: { message: 'Wrong Password' } }
}

const addRefresh = async (email, refresh) => {
    try {
        await User.updateOne({ email }, { $set: { refresh } })
        return { status: true, result: { message: 'Refresh token saved' }}
    }
    catch (e) {
        return { status: false, result: { message: 'Something went wrong' }}
    }
}

const deleteRefresh = async (email) => {
    try {
        await User.updateOne({ email }, { $set: { refresh: undefined } })
        return { status: true, result: { message: 'Refresh token deleted' }}
    }
    catch (e) {
        return { status: false, result: { message: 'Something went wrong' }}
    }
}

const checkRefresh = async (email, refresh) => {
    let user = await User.findOne({ email })
    if (!user) return { status: false, result: { message: 'User not found' } }
    if (user.refresh === refresh) {
        return { status: true, result: { message: 'Valid Refresh' } }
    }
    else {
        return { status: false, result: { message: 'Invalid refresh token' } }
    }
}

module.exports = {
    addUser,
    findUser,
    addRefresh,
    deleteRefresh,
    checkRefresh
}