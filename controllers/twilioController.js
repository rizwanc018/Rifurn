import twilio from 'twilio';
import * as dotenv from 'dotenv'
dotenv.config()


const { TWILIO_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID } = process.env
const client = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN, { lazyLoading: true });

const sendOTP = async (req, res) => {
    console.log(req.body);
    try {
        const status = await client.verify.v2.services(TWILIO_SERVICE_SID)
            .verifications
            .create({ to: '+919567376742', channel: 'sms' })
        res.status(200).send(status)
    } catch (error) {
        console.log(`error from twilio controller`, error)
        res.status(error?.status || 400).send(error?.message || 'Something went wrong')
    }
}

const verifyOTP = async (req, res) => {
    const { otp } = req.body
    try {
        const status = await client.verify.v2.services(TWILIO_SERVICE_SID)
            .verificationChecks
            .create({ to: '+919567376742', code: otp })
        console.log(status)
        res.status(200).send(status)
    } catch (error) {
        res.status(error?.status || 400).send(error?.message || 'Something went wrong')
    }
}

export { sendOTP, verifyOTP }

