import bcrypt from "bcrypt";
import UserModel from "../models/userModel.js";

const userHelper = {
    doSignup: (req, res) => {
        return new Promise(async (resolve, reject) => {
            const { mobile } = req.body
            console.log(`=============================req.body`, req.body);
            if (mobile) {
                const status = sendOTP(req, res)
                UserModel.create({ firstname: firstname, lastname: lastname, email: email, mobile: Number(mobile), password: hash })
                    .then(data => {
                        resolve(data)
                    }).catch(err => {
                        reject(err)
                    })
            } else {
                reject("no email/password")
            }
        })
    },

    // doLogin: (req) => {
    //     return new Promise(async (resolve, reject) => {
    //         const { email, password } = req.body
    //         const userCreds = await Usermodel.findOne({ email: email })
    //         if (userCreds) {
    //             const status = await bcrypt.compare(password, userCreds.password)
    //             if (status) {
    //                 resolve(userCreds)
    //             }
    //             reject("Invalid Credentials")
    //         } else {
    //             reject("Invalid Credentials")
    //         }
    //     })
    // }
}

export default userHelper