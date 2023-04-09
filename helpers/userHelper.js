import bcrypt from "bcrypt";
import UserModel from "../models/userModel.js";
import { sendOTP, verifyOTP } from "../helpers/twilioHelper.js";


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
        const status = await UserModel.updateOne({_id: userId}, {address: address}) 
    }
}

export default userHelper