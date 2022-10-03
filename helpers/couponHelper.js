const { default: mongoose } = require('mongoose');
const couponModel = require('../models/couponModel');

module.exports = {
    addCoupon: (couponData) => {
        return new Promise(async (resolve, reject) => {
            try {
                const coupon = new couponModel({
                    name: couponData.name,
                    description: couponData.desc,
                    discountPrice: couponData.price,
                    expiryDate: couponData.expDate
                })
                await coupon.save();
                resolve();
            } catch (error) {
                reject(error);
            }
        })
    },

    getAllCoupons: () => {
        return new Promise(async (resolve,reject) => {
            try {
                const coupons = await couponModel.find({}).lean();
                resolve(coupons);
            } catch (error) {
                reject(error);
            }
        })
    },

    deleteCoupon : (id) => {
        return new Promise(async (resolve,reject) => {
            try {
                await couponModel.deleteOne({_id: id});
                resolve();
            } catch (error) {
                reject(error);
            }
        })
    },

    verifyCoupon: (userId, coupon) => {
        return new Promise(async (resolve,reject) => {
            const currentDate = new Date().getTime();
            try {
                const couponData = await couponModel.findOne({name: coupon});
                if(couponData){
                    const expiryDate = Date.parse(couponData.expiryDate)
                    if(expiryDate > currentDate){
                            const hasUsed = await couponModel.findOne({$and: 
                                [{name: coupon},
                                {users: {$in: [userId]}}
                            ]})
                        if((!hasUsed)){
                            resolve({status: true, couponData});
                        }
                    }
                }
                resolve({status: false});
            } catch (error) {
                reject(error);
            }
        })
    }
}