// const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {})

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


module.exports = {

    sendOtp: (userData) => {
        return new Promise((resolve, reject) => {
            client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
                .verifications
                .create({
                    to: `+91${userData.phoneNumber}`,
                    channel: 'sms'
                })
                .then((verification) => {
                    resolve(true)
                })
                .catch((err) => {
                    reject(err)
                });
        });
    },

    verifyOtp: (otp,phoneNumber) => {
        return new Promise(async (resolve, reject) => {
            await client.verify.services(process.env.TWILIO_SERVICE_SID)
                .verificationChecks
                .create({
                    to: `+91${phoneNumber}`,
                    code: otp
                }).then((verification) => {
                    // console.log(verification);
                    resolve(verification.valid)
                }).catch((err) => {
                    reject(err);
                });
        });
    }
}