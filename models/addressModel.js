const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        addressObj: [{
            name: {
                type: String,
                required: true
            },
            phoneNumber: {
                type: Number,
                required: true
            },
            zip: {
                type: Number,
                required: true
            },
            state: {
                type: String,
                required: true
            },
            address: {
                type: String,
                required: true
            },
            locality: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            isDefault: {
                type: Boolean,
                default: false
            }
        }]
    },
    { timestamps: true }
)

module.exports = mongoose.model('address', addressSchema)