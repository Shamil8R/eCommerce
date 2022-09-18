const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

module.exports = {

    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            const emailExists = await userModel.findOne({ email: userData.email }).lean()
            if (emailExists) {
                resolve({ userExists: true, errMessage: "An account with this email already exists!" })
            } else {
                const phoneNumberExists = await userModel.findOne({ phoneNumber: userData.phoneNumber }).lean()
                if (phoneNumberExists) {
                    resolve({ userExists: true, errMessage: "An account with this phone number already exists!" })
                } else {
                    userData.password = await bcrypt.hash(userData.password, 10);
                    const user = new userModel({
                        name: userData.name,
                        email: userData.email,
                        password: userData.password,
                        phoneNumber: userData.phoneNumber,
                    });
                    try {
                        await user.save();
                        resolve({ userExists: false })
                    } catch (err) {
                        reject(err)
                    }
                }
            }
        })
    },

    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await userModel.findOne({ email: userData.email }).select('password');
                if (user) {
                    const isCorrect = await bcrypt.compare(userData.password, user.password);
                    if (isCorrect) {
                        const userDetails = await userModel.findOne({email: userData.email});
                        resolve({userDetails, status: true })
                    } else {
                        resolve({ status: false, message: "Invalid email or password" })
                    }
                } else {
                    resolve({ status: false, message: "Account doesn't exist" })
                }
            } catch (error) {
                reject(error)
            }
        })
    },

    getAllUserData: () => {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await userModel.find({}).lean();
                resolve(data);
            } catch (error) {
                reject(error)
            }
        })
    },

    changeStatus: (userId) => {
        return new Promise(async (resolve,reject) => {
            try {
                const user = await userModel.findById(userId);
                if(user.isBlocked){
                    await userModel.findByIdAndUpdate(userId,{isBlocked: false});
                }else{
                    await userModel.findByIdAndUpdate(userId,{isBlocked: true});
                }
                resolve();
            } catch (error) {
                reject(error)
            }
        })
    },

    getUserData: (userId) => {
        return new Promise(async (resolve,reject) => {
            try {
                const user = await userModel.findById(userId);
                resolve(user);
            } catch (error) {
                reject(error)
            }
        })
    },

    updateUserData: (userData, userID) => {
        return new Promise(async (resolve,reject) => {
            try {
                const emailExists = await userModel.findOne({email: userData.email});
                if(emailExists){
                    resolve({status: false, message: "An account with this email already exists!"})
                }else{
                    const phoneNumberExists = await userModel.findOne({phoneNumber: userData.phoneNumber});
                    if(phoneNumberExists){
                        resolve({status: false, message:"An account with this number already exists!"})
                    }else{
                        await userModel.findByIdAndUpdate(userID, {
                            name: userData.name,
                            email: userData.name,
                            phoneNumber: userData.phoneNumber
                        })
                        resolve({status: true})
                    }
                }
            } catch (error) {
                reject(error);
            }
        })
    }
}