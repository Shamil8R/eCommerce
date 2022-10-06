const RazorPay = require('razorpay');
const couponModel = require('../models/couponModel');

const orderModel = require('../models/orderModel');

const instance = new RazorPay({
    key_id: process.env.RAZORPAY_TEST_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = {


    placeOrder: (orderDetails, products, subTotal, userId) => {
        return new Promise(async (resolve, reject) => {

            let discountPrice = 0;
            if(orderDetails.discountPrice){
                discountPrice = parseInt(orderDetails.discountPrice);
                await couponModel.updateOne({name: orderDetails.couponName}, {$push: {users: userId}})
            }
            const total = subTotal - discountPrice;
            const isoDate = new Date()
            try {
                const order = new orderModel({
                    userId: userId,
                    products: products,
                    deliveryDetails: orderDetails,
                    subTotal: subTotal,
                    couponDiscount: discountPrice,
                    total: total,
                    paymentMethod: orderDetails.payment,
                    date: isoDate
                })
                const result = await order.save()
                resolve(result._id)
            } catch (error) {
                reject(error);
            }
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

    getSingleOrderDetails: (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                const order = await orderModel.findById(id).populate('products.product').lean()
                resolve(order)
            } catch (error) {
                reject(error)
            }
        })
    },

    getOrderDetails: (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                const orders = await orderModel.find({ _id: id }).populate('products.product').lean();
                resolve(orders[0])
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
            const product2 = await orderModel.findById(orderId).lean();
            await orderModel.updateOne({ _id: orderId },
                {
                    "products.$[].status": "Placed"
                })
            resolve();
            const product = await orderModel.findById(orderId).lean();
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
    },

    changeOrderStatusUser: (orderedProductId, status) => {
        return new Promise(async (resolve, reject) => {
            try {
                await orderModel.updateOne({ "products._id": orderedProductId },
                    {
                        "products.$.status": status
                    })
                resolve();    
            } catch (error) {
                reject(error);
            }
        })
    },

    getTotalRevenueList: () => {
        return new Promise(async (resolve,reject) => {
            try {
                const today = new Date()
                const before = new Date(new Date().getTime() - (250 * 24 * 60 * 60 * 1000));
                let revenue = await orderModel.aggregate([
                    {
                        $match: {
                            createdAt: { 
                                $gte: before,
                                $lte: today
                            }
                        }
                    },
                    {
                        $project: {
                            paymentMethod: 1, total: 1, createdAt: 1
                        }
                    },
                    {
                        $group: {
                            _id: {date: {$dateToString: {format: "%m-%Y", date: "$createdAt"}}, method: "$paymentMethod"},
                            amount: {$sum: "$total"}
                        }
                    },
                    {
                        $project: {
                            date: "$_id.date",
                            method: "$_id.method",
                            amount: "$amount",
                            _id: 0
                        }
                    }
                ])
                let obj = {
                    date: [], cod: [0,0,0,0,0,0,0,0], online: [0,0,0,0,0,0,0,0],
                }
                let month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                let a = today.getMonth() - 6;
                for(let i=0; i<8; i++){
                    for(let k = 0; k< revenue.length; k++){
                        if(Number(revenue[k].date.slice(0,2) == Number(a + i))){        //
                            if(revenue[k].method == 'UPI'){
                                obj.online[i] = revenue[k].amount; 
                            }else{
                                obj.cod[i] = revenue[k].amount; 
                            }
                        }
                    }
                    obj.date[i] = month[a + i - 1];
                }
                resolve(obj);
            } catch (error) {
                reject(error);
            }
        })
    },

    getCountByPayment: () => {
        return new Promise(async (resolve,reject) => {
            try {
                const [codCount,upiCount] = await Promise.allSettled([
                    orderModel.count({paymentMethod: 'COD'}),
                    orderModel.count({paymentMethod: 'UPI'})                
                ])
                const obj = {
                    paymentMethod: ["COD","UPI"],
                    count: [codCount.value,upiCount.value]
                }
                resolve(obj);
            } catch (error) {
                reject(error);
            }
        })
    }
}