const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    phoneNumber: {
        type: Number,
        required: true,
        unique: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orders'
    }]
}, { timestamps: true })

module.exports = mongoose.model("user", userSchema);