const RazorPay = require('razorpay');

const orderModel = require('../models/orderModel');

const instance = new RazorPay({
    key_id: process.env.RAZORPAY_TEST_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = {


    placeOrder: (orderDetails, products, totalPrice, userId) => {
        return new Promise(async (resolve, reject) => {
            // console.log(products)
            const date = new Date();
            const orderDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + (date.getHours() + 1) + ":" + (date.getMinutes() + 1);
            let status = orderDetails.payment === 'COD' ? 'Placed' : 'Pending';
            const order = new orderModel({
                userId: userId,
                products: products,
                deliveryDetails: orderDetails,
                amount: totalPrice,
                status: status,
                paymentMethod: orderDetails.payment,
                date: orderDate
            })
            const result = await order.save()
            resolve(result._id)
        })
    },

    getAllOrders: () => {
        return new Promise(async (resolve, reject) => {
            try {
                const orders = await orderModel.find({}).sort({ date: -1 }).lean()
                resolve(orders)
            } catch (error) {
                reject(error)
            }
        })
    },

    getOrders: (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const orders = await orderModel.find({ userId: userId }).populate('products.product').sort({ date: -1 }).lean();
                resolve(orders)
            } catch (error) {
                reject(error)
            }
        })
    },

    // getSingleOrderDetails: (id) => {
    //     return new Promise(async (resolve,reject) => {
    //         try {//Pull, store and insert
    //             const selectedProduct = await orderModel.findOne({"products._id": id},{_id: 0, "products.$": 1}).populate('products.product').lean()
    //             // await orderModel.findOne({"products._id": selectedProduct})
    //             resolve({selectedProduct, orderDetails})
    //         } catch (error) {
    //             reject(error)                
    //         }
    //     })
    // },

    getOrderDetails: (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                const orders = await orderModel.find({ _id: id }).populate('products.product').lean()
                console.log(orders);
                resolve(orders)
            } catch (error) {
                reject(error)
            }
        })
    },

    generateRazorPay: (orderId, total) => {
        return new Promise(async (resolve, reject) => {
            try {
                const options = {
                    amount: total * 100,  // amount in the smallest currency unit
                    currency: "INR",
                    receipt: orderId
                };
                instance.orders.create(options, function (err, order) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(order)
                    }
                });
            } catch (error) {
                reject(error)
            }
        })
    },

    verifyPayment: (details) => {
        return new Promise(async (resolve, reject) => {
            const crypto = require('crypto');
            let hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);

            hmac.update(details['payment[razorpay_order_id]'] + '|' + details['payment[razorpay_payment_id]']);
            hmac = hmac.digest('hex');
            if (hmac == details['payment[razorpay_signature]']) {
                resolve({ status: true })
            } else {
                resolve({ status: false })
            }
        })
    },

    changePaymentStatus: (orderId) => {
        return new Promise(async (resolve, reject) => {
            await orderModel.updateOne({ _id: orderId },
                {
                    status: "Placed"
                })
            resolve();
        })
    },

    changeDeliveryStatus: (orderId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const order = await orderModel.findById(orderId);
                // if (order.status === "Placed") {
                //     await orderModel.findByIdAndUpdate(orderId,
                //         {
                //             status: "Shipped",
                //             isShipped: true,
                //         });
                //     resolve();
                // }
                if (order) {
                    switch (order.status) {
                        case "Placed": await orderModel.findByIdAndUpdate(orderId,
                            {
                                status: "Shipped",
                                isShipped: true,
                            });
                            break;
                        case "Shipped": await orderModel.findByIdAndUpdate(orderId,
                            {
                                status: "Out For Delivery",
                                isShipped: false,
                                isOutForDelivery: true,
                            });
                            break;
                        case "Out For Delivery": await orderModel.findByIdAndUpdate(orderId,
                            {
                                status: "Delivered",
                                isOutForDelivery: false,
                                isDelivered: true
                            });
                            break;
                        case "Delivered": await orderModel.findByIdAndUpdate(orderId,
                            {
                                status: "Cancelled",
                                isDelivered: false,
                                isCancelled: true,
                            });
                            break;
                        case "Cancelled": await orderModel.findByIdAndUpdate(orderId,
                            {
                                status: "Placed",
                                isCancelled: false,
                            });
                            break;
                        default: ""
                            break;
                    }
                    resolve();
                }
            } catch (error) {
                reject(error)
            }
        })
    }
}