import bcrypt from "bcrypt";
import UserModel from "../models/userModel.js";
import instance from "../utils/razorpay.js";
import crypto from 'crypto';
import * as dotenv from 'dotenv'
dotenv.config()


const userHelper = {
    isEmailExist: async (email) => {
        const isExist = await UserModel.exists({ email: email })
        return isExist
    },
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
    getUser: async (email, password) => {
        console.log(email, password)
        const user = await UserModel.findOne({ email: email })
        return user
    },
    getUSerbyId: async (id) => {
        const user = await UserModel.findById(id)
        return user
    },
    getallUsers: async () => {
        const allUsers = await UserModel.find({})
        if (allUsers) return allUsers
    },
    // doOTPLogin: (req, res) => {
    //     return new Promise(async (resolve, reject) => {
    //         let { email } = req.body
    //         if (email) {
    //             console.log(`--------------`, email);
    //             const emailExist = await UserModel.exists({ email: email })
    //             if (emailExist) {
    //                 const status = await sendOTP(mobile)
    //                 resolve(status.to)
    //             } else {
    //                 reject("Number does not exist")
    //             }
    //         }
    //     })
    // },
    // doOTPVerificationForLogin: (req, res) => {
    //     const { mobile, otp } = req.body
    //     return new Promise(async (resolve, reject) => {
    //         if (otp) {
    //             const status = await verifyOTP(mobile, otp)
    //             if (status.valid) {
    //                 resolve(status)
    //             } else {
    //                 reject("Invalid OTP")
    //             }
    //         } else {
    //             reject("Invalid OTP")
    //         }
    //     })
    // },
    deleteUser: async (id) => {
        const data = await UserModel.deleteOne({ _id: id })
        console.log(data)
        return data
    },
    updateUser: async (id, blockstatus) => {
        const status = UserModel.updateOne({ _id: id }, { blocked: blockstatus })
        return status
    },
    updateAddress: async (userId, address) => {
        const data = {
            firstname: address.firstname,
            lastname: address.lastname,
            mobile: address.mobile,
            addr1: address.addr1,
            addr2: address.addr2,
            town: address.town,
            state: address.state,
            country: address.country,
            zip: address.zip,
        }
        const status = await UserModel.updateOne({ _id: userId },
            {
                $addToSet:
                {
                    address: address
                }
            })
    },
    generateRazorpay: async (orderId, total) => {
        const options = {
            amount: total * 100,
            currency: "INR",
            receipt: "" + orderId,
            notes: {
                key1: "value3",
                key2: "value2"
            }
        }
        const rzpOrder = await instance.orders.create(options)
        return rzpOrder
    },
    verifyPayment: async (paymentDetails) => {
        let hmac = crypto.createHmac('sha256', process.env.RZP_KEY_SECRET)
        hmac.update(paymentDetails['payment[razorpay_order_id]'] + '|' + paymentDetails['payment[razorpay_payment_id]'])
        hmac = hmac.digest('hex')
        if (hmac == paymentDetails['payment[razorpay_signature]']) {
            console.log("🚀 ~ file: userHelper.js:119 ~ verifyPayment: ~ hmac:", hmac)
            return { paymentStatus: true }
        } else {
            console.log("🚀 ~ file: userHelper.js:119 ~ verifyPayment: ~ hmac:", 'failed')
            return { paymentStatus: false }
        }
    }
}

export default userHelper