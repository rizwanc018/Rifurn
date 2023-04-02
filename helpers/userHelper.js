import bcrypt from "bcrypt";
import UserModel from "../models/userModel.js";
import { sendOTP, verifyOTP } from "../helpers/twilioHelper.js";


const userHelper = {
    isEmailExist: async(email) => {
     const isExist  =  await UserModel.exists({ email: email })
     return isExist
    },
    // doSignup: (req, res) => {
    //     return new Promise(async (resolve, reject) => {
    //         let { mobile } = req.body
    //         mobile = Number("91" + mobile)
    //         if (mobile) {
    //             const numberExist = await UserModel.exists({ mobile: mobile })
    //             if (numberExist) {
    //                 reject("Number already exist try login")
    //             } else {
    //                 const status = await sendOTP(mobile)
    //                 resolve(status.to)
    //             }
    //         } else {
    //             reject("Invalid mobile number")
    //         }
    //     })
    // },
    doOTPVerification: (req, res) => {
        const otp = req.body.otp
        const ogOtp = req.session.user.otp
        if (otp === ogOtp) {
            return true
        } else {
            return false
        }
    },
    createUser: async (req) => {
        const { firstname, lastname, email, mobile, password } = req.session.user
        const hash = await bcrypt.hash(password, 10)
        const userData = await UserModel.create({ firstname, lastname, email, mobile, password: hash })
        return userData
    },
    doOTPLogin: (req, res) => {
        return new Promise(async (resolve, reject) => {
            let { mobile } = req.body
            mobile = Number("91" + mobile)
            if (mobile) {
                const numberExist = await UserModel.exists({ mobile: mobile })
                if (numberExist) {
                    const status = await sendOTP(mobile)
                    resolve(status.to)
                } else {
                    reject("Number does not exist")
                }
            }
        })
    },
    doOTPVerificationForLogin: (req, res) => {
        const { mobile, otp } = req.body
        return new Promise(async (resolve, reject) => {
            if (otp) {
                const status = await verifyOTP(mobile, otp)
                console.log("user helper---------------------");
                if (status.valid) {
                    resolve(status)
                } else {
                    reject("Invalid OTP")
                }
            } else {
                reject("Invalid OTP")
            }
        })
    },

}

export default userHelper