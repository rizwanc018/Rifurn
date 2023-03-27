import twilio from 'twilio';
import * as dotenv from 'dotenv'
dotenv.config()


const { TWILIO_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID } = process.env
const client = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN, { lazyLoading: true });

const sendOTP = (mobileNum) => {
    return new Promise(async (resolve, reject) => {
        client.verify.v2.services(TWILIO_SERVICE_SID)
            .verifications
            .create({ to: `+91${mobileNum}`, channel: 'sms' })
            .then(status => {
                resolve(status)
            }).catch(err => {
                reject(err)
            })
    })
}

const verifyOTP = async (mobile, otp) => {
    return new Promise(async (resolve, reject) => {
        client.verify.v2.services(TWILIO_SERVICE_SID)
            .verificationChecks
            .create({ to: mobile, code: otp })
            .then(status => {
                resolve(status)
            }).catch(err => {
                reject(err || 'Something went wrong')
            })
    })
}

export { sendOTP, verifyOTP }

