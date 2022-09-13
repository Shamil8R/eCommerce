const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        products: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product'
        }],
    }, { timestamps: true })

module.exports = mongoose.model("cart", cartSchema);