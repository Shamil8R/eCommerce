const orderModel = require('../models/orderModel');

module.exports = {

    placeOrder: (orderDetails, products, totalPrice, userId) => {
        return new Promise(async (resolve,reject) => {
            let status = orderDetails.payment === 'COD' ? 'Placed': 'Pending';
            const order = new orderModel({
                userId: userId,
                products: products,
                deliveryDetails: orderDetails,
                amount: totalPrice,
                status: status,
                paymentMethod: orderDetails.payment,
                date: new Date()
            })

            order.save()
            resolve({status: true})
        })
    }
}