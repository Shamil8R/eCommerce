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
                        fname: userData.fname,
                        lname: userData.lname,
                        email: userData.email,
                        password: userData.password,
                        phoneNumber: userData.phoneNumber,
                    });
                    try {
                        await user.save();
                        resolve({userExists: false})
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
                const user = await userModel.findOne({ email: userData.email });
                if (user) {
                    const isCorrect = await bcrypt.compare(userData.password, user.password);
                    if (isCorrect) {
                        resolve({ status: true })
                    } else {
                        resolve({ status: false, message: "Invalid email or password" })
                    }
                } else {
                    resolve({ status: false, message: "Account doesn't exist" })
                }
            } catch (error) {
                reject("Some database error")
            }
        })
    },
}