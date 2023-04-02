import userHelper from "../helpers/userHelper.js";
import { sendOTP } from "../services/mailer.js";
import generateOTP from "../services/otp.js";

const userController = {
    doSignup: async (req, res) => {
        const email = req.body.email
        const isExist = await userHelper.isEmailExist(email)
        if(!isExist) {
            const otp = generateOTP()
            req.session.user = req.body
            req.session.user.otp = otp
            console.log(`-----------------------------otp`,otp);
            await sendOTP(email, otp)
            res.status(200).send(email)
        } else {
            res.status(400).send("Email already Exist")
            console.log("already exist");
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
    }
}

export default userController