import userHelper from "../helpers/userHelper.js";
import { sendOTP } from "../services/mailer.js";
import generateOTP from "../services/otp.js";
import bcrypt from "bcrypt";


const userController = {
    doSignup: async (req, res) => {
        const email = req.body.email
        const isExist = await userHelper.isEmailExist(email)
        if (!isExist) {
            const otp = generateOTP()
            req.session.user = req.body
            req.session.user.otp = otp
            // console.log(`-----------------------------otp`, otp);
            await sendOTP(email, otp)
            res.status(200).send(email)
        } else {
            res.status(400).send("Email already Exist")
        }
    },
    doOTPVerification: async (req, res) => {
        const status = userHelper.doOTPVerification(req, res)
        if (status) {
            const userData = await userHelper.createUser(req);
            req.session.user = {}
            req.session.user.name = userData.firstname
            req.session.user.id = userData._id
            req.session.user.blocked = userData.blocked
            req.session.user.loggedin = true
            res.status(200).send(status)
        }
        else {
            res.status(400).send(status)
        }
    },
    doPasswordLogin: async (req, res) => {
        const { email, password } = req.body
        const user = await userHelper.getUser(email, password)
        if (user) {
            const status = await bcrypt.compare(password, user.password)
            if (status) {
                req.session.user = {}
                req.session.user.name = user.firstname
                req.session.user.id = user._id
                req.session.user.blocked = user.blocked
                req.session.user.loggedin = true
                res.status(200).send(status)
            } else {
                res.status(400).send("Invalid credentials")
            }
        } else {
            res.status(400).send("Invalid credentials")
        }
    },
    reSendOtp: async (req, res) => {
        if (req.session.user) {
            const otp = generateOTP()
            const email = req.session.user.email
            req.session.user.otp = otp
            // console.log(`-----------------------------otp`, otp);
            await sendOTP(email, otp)
            res.status(200).send("OTP send")
        } else {
            res.status(400)
        }
    },
    doOTPLogin: (req, res) => {
        userHelper.doOTPLogin(req, res)
            .then(data => {
                res.status(200).send(data)
            }).catch(err => {
                console.log(err)
                res.status(400).send(err)
            })
    },
    doOTPVerificationForLogin: (req, res) => {
        userHelper.doOTPVerificationForLogin(req, res)
            .then(data => {
                res.status(200).send(data)
            }).catch(err => {
                res.status(400).send(err)
            })
    },
    getAllUsers: async (req, res) => {
        const allUsers = await userHelper.getallUsers()
        if (allUsers) { res.render('admin/users', { isAdmin: true, allUsers }) }
        else { res.redirect('/admin/dashboard') }
    },
    deleteUser: async (req, res) => {
        const id = req.params.id
        const response = await userHelper.deleteUser(id)
        response.acknowledged ? res.redirect('/admin/users') : res.send("Couldn't delete user something went wrong")
    },
    toggleUserRestriction: async (req, res) => {
        const id = req.params.id
        const user = await userHelper.getUSerbyId(id)
        const blockstatus = !user.blocked
        const status = await userHelper.updateUser(id, blockstatus)
        if(status.acknowledged) {
            res.status(200).send(blockstatus)
        } else {
            res.status(400).send("something went wrong")
        }
    }
    // showUserEditPage: async (req, res) => {
    //     const id = req.params.id
    //     const user = await userHelper.getUSerbyId(id)
    // }
}

export default userController