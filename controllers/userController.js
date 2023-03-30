import userHelper from "../helpers/userHelper.js";
import { sendMail } from "../services/mailer.js";

const userController = {
    doSignup: (req, res) => {
        sendMail("333")
        console.log(req.body);
        res.send(req.body.email)
        // userHelper.doSignup(req, res)
        //     .then(data => {
        //         res.send(data)
        //     }).catch(err => {
        //         res.status(400).send(err)
        //     })
    },
    doOTPVerification: (req, res) => {
        console.log(req.body)
        // userHelper.doOTPVerificationForSignup(req, res)
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