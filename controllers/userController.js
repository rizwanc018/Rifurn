import userHelper from "../helpers/userHelper.js";

const userController = {
    doSignup : (req, res) => {
        userHelper.doSignup(req, res)
        .then(data => {
            res.send(data)
        }).catch(err => {
            res.send(err)
        })
    }
}

export default userController