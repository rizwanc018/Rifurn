import userHelper from "../helpers/userHelper.js";

const userController = {
    doSignup : (req, res) => {
        userHelper.doSignup(req, res)
        .then(data => {
            res.send(data)
        }).catch(err => {
            res.status(400).send(err)
        })
    },
    doOTPVerification: (req, res) => {
        userHelper.doOTPVerificationForSignup(req, res)
        .then(data => {
            res.status(200).send(data)
        }).catch(err => {
            res.send(err)
        })
    }
}

export default userController