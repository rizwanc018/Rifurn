import userHelper from "../helpers/userHelper.js";
import { sendOTP } from "../services/mailer.js";
import generateOTP from "../services/otp.js";

const userController = {
    doSignup: async (req, res) => {
        const otp = generateOTP()
        const email = req.body.email
        req.session.user = req.body
        req.session.user.otp = otp
        console.log(`-----------------------------otp`,otp);
        await sendOTP(email, otp)
        res.send(email)
        // userHelper.doSignup(req, res)
        //     .then(data => {
        //         res.send(data)
        //     }).catch(err => {
        //         res.status(400).send(err)
        //     })
    },
    doOTPVerification: (req, res) => {
        const status = userHelper.doOTPVerification(req, res)
        if (status) {
            req.session.user.otp = null
            console.log(userHelper.createUser(req));
            res.status(200).send(status)
        }
        else {
            res.status(400).send(status)
        }
        //     .then(data => {
        //         res.status(200).send(data)
        //     }).catch(err => {
        //         res.status(400).send(err)
        //     })
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