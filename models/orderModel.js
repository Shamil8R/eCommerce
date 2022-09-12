const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
        userId: {
            type: String,
            required: true,
        },
        products: [
            {
                productId:{
                    type:String
                },
                quantity:{
                    type: Number,
                    default: 1
                }
            }
        ],
        amount:{
            type: Number,
            required: true
        },
        address: {
            type: Object,
            required: true,
        },
        status:{
            type:String,
            default: "Pending"
        },
        paymentMethod:{
            type: String,
            required: true
        },
})

module.exports = mongoose.model("order", orderSchema);