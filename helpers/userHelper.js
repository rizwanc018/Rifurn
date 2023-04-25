import bcrypt from "bcrypt";
import UserModel from "../models/userModel.js";
import instance from "../utils/razorpay.js";
import crypto from 'crypto';
import * as dotenv from 'dotenv'
dotenv.config()


const userHelper = {
    isEmailExist: async (email) => {
        try {
            const isExist = await UserModel.exists({ email: email })
            return isExist
        } catch (error) {
            console.log("🚀 ~ file: userHelper.js:15 ~ isEmailExist: ~ error:", error)
        }
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
        try {
            const { firstname, lastname, email, mobile, password } = req.session.user
            const hash = await bcrypt.hash(password, 10)
            const userData = await UserModel.create({ firstname, lastname, email, mobile, password: hash })
            return userData
        } catch (error) {
            console.log("🚀 ~ file: userHelper.js:34 ~ createUser: ~ error:", error)
        }
    },
    getUser: async (email, password) => {
        try {
            const user = await UserModel.findOne({ email: email })
            return user
        } catch (error) {
            console.log("🚀 ~ file: userHelper.js:42 ~ getUser: ~ error:", error)
        }
    },
    getUSerbyId: async (id) => {
        try {
            const user = await UserModel.findById(id)
            return user
        } catch (error) {
            console.log("🚀 ~ file: userHelper.js:50 ~ getUSerbyId: ~ error:", error)
        }
    },
    getallUsers: async () => {
        try {
            const allUsers = await UserModel.find({})
            if (allUsers) return allUsers
        } catch (error) {
            console.log("🚀 ~ file: userHelper.js:58 ~ getallUsers: ~ error:", error)
        }
    },

    deleteUser: async (id) => {
        try {
            const data = await UserModel.deleteOne({ _id: id })
            return data
        } catch (error) {
            console.log("🚀 ~ file: userHelper.js:67 ~ deleteUser: ~ error:", error)
        }
    },
    updateUser: async (id, blockstatus) => {
        try {
            const status = UserModel.updateOne({ _id: id }, { blocked: blockstatus })
            return status
        } catch (error) {
            console.log("🚀 ~ file: userHelper.js:75 ~ updateUser: ~ error:", error)
        }
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
        try {
            const status = await UserModel.findOneAndUpdate({ _id: userId },
                {
                    $addToSet:
                    {
                        address: address
                    }
                }, { new: true })
            return status
        } catch (error) {
            console.log("🚀 ~ file: userHelper.js:96 ~ updateAddress: ~ error:", error.message)

        }
    },
    generateRazorpay: async (total) => {
        const options = {
            amount: total * 100,
            currency: "INR",
            receipt: "SSS"
        }
        try {
            const rzpOrder = await instance.orders.create(options)
            return rzpOrder
        } catch (error) {
            console.log("🚀 ~ file: userHelper.js:114 ~ generateRazorpay: ~ error:", error)
        }
    },
    verifyPayment: async (paymentDetails) => {
        let hmac = crypto.createHmac('sha256', process.env.RZP_KEY_SECRET)
        hmac.update(paymentDetails['payment[razorpay_order_id]'] + '|' + paymentDetails['payment[razorpay_payment_id]'])
        hmac = hmac.digest('hex')
        if (hmac == paymentDetails['payment[razorpay_signature]']) {
            return { paymentStatus: true }
        } else {
            return { paymentStatus: false }
        }
    },
    getUsersCount: async () => {
        try {
            const [users] = await UserModel.aggregate([
                {
                    $match: { _id: { $ne: "" } },
                },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 },
                    }
                }
            ])
            return users.count
        } catch (error) {
            console.log("🚀 ~ file: userHelper.js:131 ~ getUsersCount: ~ error:", error)
        }
    }
}

export default userHelper