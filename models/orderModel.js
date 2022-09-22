const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    products: [{
        type: Object
    }],
    amount: {
        type: Number,
        required: true
    },
    deliveryDetails: {
        type: Object,
        required: true,
    },
    status: {
        type: String,
        default: "Pending"
    },
    paymentMethod: {
        type: String,
        required: true
    },
    date: {
        type: Date
    }
})

module.exports = mongoose.model("order", orderSchema);