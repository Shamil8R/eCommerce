const addressModel = require('../models/addressModel');

module.exports = {

    addAddress: (formData, userId) => {
        return new Promise(async (resolve, reject) => {
            const address = await addressModel.findOne({ userId: userId });
            console.log(address);
            if (address) {
                await addressModel.updateOne({ userId: userId },
                    {
                        $push: {
                            addressObj: {
                                name: formData.name,
                                phoneNumber: formData.phoneNumber,
                                zip: formData.zip,
                                state: formData.state,
                                address: formData.address,
                                locality: formData.locality,
                                city: formData.city,
                            }
                        }
                    });
                resolve({ status: true, message: "Address successfully added." })
            } else {
                const address = new addressModel({
                    userId: userId,
                    addressObj: {
                        name: formData.name,
                        phoneNumber: formData.phoneNumber,
                        zip: formData.zip,
                        state: formData.state,
                        address: formData.address,
                        locality: formData.locality,
                        city: formData.city,
                    }
                })
                address.save()
                resolve({ status: true, message: "Address successfully added." })
            }
        })
    },

    getAddresses: (userId) => {
        return new Promise(async (resolve, reject) => {
            const addresses = await addressModel.findOne({ userId: userId }).lean();
            resolve(addresses);
        })
    },

    getOneAddress: (data) => {
        return new Promise(async (resolve, reject) => {
            const address = await addressModel.findOne({ "addressObj._id": data.addressId }, { _id: 0, 'addressObj.$': 1 }).lean()
            resolve(address.addressObj[0])
        })
    },

    updateAddress: (data) => {
        return new Promise(async (resolve, reject) => {
            const address = await addressModel.findOne({"addressObj._id": data.id});
            console.log(address);
            await addressModel.updateOne({ "addressObj._id": data.id },
                {
                    "addressObj.$":{
                        name: data.name,
                        phoneNumber: data.phoneNumber,
                        zip: data.zip,
                        state: data.state,
                        address: data.address,
                        locality: data.locality,
                        city: data.city,
                    }
                })
            resolve()    
        })
    },

    deleteAddress: (data) => {
        return new Promise(async (resolve,reject) => { 
            await addressModel.updateOne({"addressObj._id": data.addressId},
            {$pull: {addressObj: {_id: data.addressId}}})
            resolve()
        })
    }
}