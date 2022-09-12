const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
        fname: {
            type: String,
            required: true,
        },
        lname: {
            type: String
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        },
        phoneNumber:{
            type: Number,
            required: true,
            unique: true
        },
        isAdmin:{
            type: Boolean,
            default:false
        },
        isBlocked: {
            type: Boolean,
            default: false
        },       
},{timestamps: true})

module.exports = mongoose.model("user", userSchema);