import twilio from 'twilio';
import * as dotenv from 'dotenv'
dotenv.config()


const { TWILIO_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID } = process.env
const client = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN, { lazyLoading: true });

const sendOTP = async (req, res) => {
    const { mobile } = req.body
    try {
        const status = await client.verify.v2.services(TWILIO_SERVICE_SID)
            .verifications
            .create({ to: `+91${mobile}`, channel: 'sms' })
        console.log(`from otp--------------`, status);
        res.status(200).send(status.to)
    } catch (error) {
        res.status(error?.status || 400).send(error?.message || 'Something went wrong')
    }
}

const verifyOTP = async (req, res) => {
    const { otp, mobile } = req.body
    try {
        const status = await client.verify.v2.services(TWILIO_SERVICE_SID)
            .verificationChecks
            .create({ to: mobile, code: otp })
        console.log(`from verify ----------------`, status)
        res.status(200).send(status)
    } catch (error) {
        res.status(error?.status || 400).send(error?.message || 'Something went wrong')
    }
}

export { sendOTP, verifyOTP }

