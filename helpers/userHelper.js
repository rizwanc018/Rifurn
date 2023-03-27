import bcrypt from "bcrypt";
import UserModel from "../models/userModel.js";
import { sendOTP, verifyOTP } from "../helpers/twilioHelper.js";


const userHelper = {
    doSignup: (req, res) => {
        return new Promise(async (resolve, reject) => {
            let { mobile } = req.body
            mobile = Number("91" + mobile)
            if (mobile) {
                const numberExist = await UserModel.exists({ mobile: mobile })
                if (numberExist) {
                    reject("Number already exist try login")
                } else {
                    const status = await sendOTP(mobile)
                    resolve(status.to)
                }
            } else {
                reject("Invalid mobile number")
            }
        })
    },
    doOTPVerificationForSignup: (req, res) => {
        const { mobile, otp } = req.body
        return new Promise(async (resolve, reject) => {
            if (otp) {
                const status = await verifyOTP(mobile, otp)
                if (status.valid) {
                    UserModel.create({ mobile: mobile })
                    resolve(status)
                }
            } else {
                reject("Invalid OTP")
            }
        })
    }
}

export default userHelper