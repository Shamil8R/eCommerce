const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String
    },
    discountPrice: {
        type: Number
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    expiryDate: {
        type: Date
    }
});

module.exports = mongoose.model("coupon", couponSchema);