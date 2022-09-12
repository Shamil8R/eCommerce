const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
        productName: {
            type: String,
            required: true,
            unique: true
        },
        brandName: {
            type: String,
            required: true
        },
        desc: {
            type: String,
            required: true,
        },
        img: [{
            type: String,
        }],
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'category',
            required: true       
        },
        price:{
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true
        },
        offer: {
            type: Number
        },
        isFeatured: {
            type: Boolean,
            default: false
        }
},{timestamps: true})

module.exports = mongoose.model("product", productSchema);