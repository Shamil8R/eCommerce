const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
    {
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
            }
        }],
    }, { timestamps: true })

module.exports = mongoose.model("cart", cartSchema, 'cart');