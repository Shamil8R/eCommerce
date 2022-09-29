const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product'
        },
        quantity: {
            type: Number,
            default: 1
        },
        totalPrice: {
            type: Number
        },
        status: {
            type: String,
            default: "Pending"
        },    
    }],
    amount: {
        type: Number,
        required: true
    },
    deliveryDetails: {
        type: Object,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true
    },
    date: {
        type: String
    }
})

module.exports = mongoose.model("order", orderSchema);