import userHelper from "../helpers/userHelper.js";
import { sendOTP } from "../services/mailer.js";
import generateOTP from "../services/otp.js";
import bcrypt from "bcrypt";
import UserModel from "../models/userModel.js";
import productHelper from "../helpers/productHelpers.js";
import cartHelper from "../helpers/cartHelper.js";
import orderHelper from "../helpers/orderHelper.js";


const userController = {
    doSignup: async (req, res) => {
        const email = req.body.email
        const isExist = await userHelper.isEmailExist(email)
        if (!isExist) {
            const otp = generateOTP()
            console.log('------------------------', otp)
            req.session.user = req.body
            req.session.user.otp = otp
            await sendOTP(email, otp)
            res.status(200).send(email)
        } else {
            res.status(400).send("Email already Exist")
        }
    },
    doOTPVerificationForPasswordChange: async (req, res) => {
        const status = userHelper.doOTPVerification(req, res)
        res.status(200).send(status)
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
        // console.log(user.blocked);
        if (user) {
            if (user.blocked) {
                res.status(400).send("You are blocked")
            } else {
                const status = await bcrypt.compare(password, user.password)
                if (status) {
                    req.session.user = {}
                    req.session.user.name = user.firstname
                    req.session.user.id = user._id
                    req.session.user.blocked = user.blocked
                    req.session.user.loggedin = true
                    const products = await productHelper.getAllProducts()
                    res.render('index', { products, isUserLoggedin: req.session.user.loggedin })
                    // res.redirect('/')
                } else {
                    res.status(400).send("Invalid credentials")
                }
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
            await sendOTP(email, otp)
            res.status(200).send("OTP send")
        } else {
            res.status(400)
        }
    },
    forgotPassword: async (req, res) => {
        const email = req.body.email
        const isExist = await userHelper.isEmailExist(email)
        if (isExist) {
            const otp = generateOTP()
            req.session.user = {}
            req.session.user.email = email
            req.session.user.otp = otp
            console.log(`-----------------------------otp`, otp);
            await sendOTP(email, otp)
            res.status(200).send(email)
        } else {
            res.status(200).send(false)
        }

    },
    changePassword: async (req, res) => {
        const email = req.session.user.email
        const password = req.body.password
        const hash = await bcrypt.hash(password, 10)
        console.log(email, password, hash);
        const user = await UserModel.findOneAndUpdate({ email: email }, { password: hash })

        req.session.user = {}
        req.session.user.name = user.firstname
        req.session.user.id = user._id
        req.session.user.blocked = user.blocked
        req.session.user.loggedin = true

        if (user) res.status(200).send(true)
        else res.status(400).send("Something wrong")
    },
    getAllUsers: async (req, res) => {
        const allUsers = await userHelper.getallUsers()
        if (allUsers) { res.render('admin/users', { isAdmin: req.session.isAdmin, allUsers }) }
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
        if (status.acknowledged) {
            res.status(200).send(blockstatus)
        } else {
            res.status(400).send("something went wrong")
        }
    },
    doLogOut: (req, res) => {
        req.session.user = null
        res.redirect('/')
    },
    showCheckoutPage: async (req, res) => {
        const userId = req.session.user.id
        const cartItems = await cartHelper.getCartData(userId)
        const total = cartItems.reduce((total, item) => {
            return total + item.subTotal
        }, 0)
        const userData = await userHelper.getUSerbyId(userId)
        console.log("🚀 ~ file: userController.js:153 ~ showCheckoutPage: ~ userData:", userData)
        res.render('checkout', { cartItems, total, userData })
    },
    placeOrder: async (req, res) => {
        const userId = req.session.user.id        
        let { mobile, addr1, addr2, country, town, state, zip, paymentMethod, accepTerms } = req.body
        country = country.charAt(0).toUpperCase() + country.slice(1)
        state = state.charAt(0).toUpperCase() + state.slice(1)
        town = town.charAt(0).toUpperCase() + town.slice(1)
        const address = {
            addr1: addr1,
            addr2: addr2,
            town: town,
            state: state,
            country: country,
            zip: zip
        }
        const updateAddressStatus = await userHelper.updateAddress(userId, address)
        const cartData = await cartHelper.getItemsAndDeleteCart(userId)
        const orderdata = await orderHelper.createOrder(userId, cartData, address, mobile)
        res.status(200).send("Order Placed Successfully")
    }
}

export default userController