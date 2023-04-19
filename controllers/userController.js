import userHelper from "../helpers/userHelper.js";
import { sendOTP } from "../services/mailer.js";
import generateOTP from "../services/otp.js";
import bcrypt from "bcrypt";
import UserModel from "../models/userModel.js";
import productHelper from "../helpers/productHelpers.js";
import cartHelper from "../helpers/cartHelper.js";
import orderHelper from "../helpers/orderHelper.js";
import { response } from "express";

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
        const discount = req.session.user.discount || 0
        const cartItems = await cartHelper.getCartData(userId)
        const total = cartItems.reduce((total, item) => {
            return total + item.subTotal
        }, 0)
        const grandTotal = total - discount
        const userData = await userHelper.getUSerbyId(userId)
        if (!cartItems.length) {
            console.log("🚀 ~ file: userController.js:143 ~ showCheckoutPage: ~ cartItems:", cartItems)
            res.redirect('/user/cart')
            return
        }
        res.render('checkout', { cartItems, total, userData, discount, grandTotal })
    },
    placeOrder: async (req, res) => {
        const userId = req.session.user.id
        const discount = req.session.user.discount || 0
        req.session.user.discount = 0
        let { firstname, lastname, mobile, addr1, addr2, country, town, state, zip, paymentMethod, saveAddress, accepTerms } = req.body
        country = country.charAt(0).toUpperCase() + country.slice(1)
        state = state.charAt(0).toUpperCase() + state.slice(1)
        town = town.charAt(0).toUpperCase() + town.slice(1)
        const address = {
            firstname: firstname,
            lastname: lastname,
            mobile: mobile,
            addr1: addr1,
            addr2: addr2,
            town: town,
            state: state,
            country: country,
            zip: zip
        }
        if (saveAddress == 'true') {
            const updateAddressStatus = await userHelper.updateAddress(userId, address)
        }
        const cartData = await cartHelper.getItemsAndDeleteCart(userId)
        const orderdata = await orderHelper.createOrder(userId, cartData, address, discount)
        console.log("🚀 ~ file: userController.js:174 ~ placeOrder: ~ orderdata:", orderdata)
        let total = await orderHelper.getTotal(orderdata._id)   // total: [ { total: 6200 } ]
        total = total[0].total - discount

        if (paymentMethod === 'COD') {
            res.status(200).send({ codSuccess: true, msg: 'Order Placed Successfully', orderId: orderdata._id })
        } else if (paymentMethod === 'payNow') {
            const rzpOrder = await userHelper.generateRazorpay(orderdata._id, total)
            res.status(200).send(rzpOrder)
        }
    },
    cancelOrder: async (req, res) => {
        const { orderId } = req.body
        const status = await orderHelper.updateStatus(orderId, "cancelled")
        res.status(200).send("Order Cancelled")
    },
    showProfilePage: async (req, res) => {
        const userId = req.session.user.id
        const userData = await userHelper.getUSerbyId(userId)
        console.log("🚀 ~ file: userController.js:181 ~ showProfilePage: ~ userData:", userData)
        res.render('profile', { userData, isUserLoggedin: req.session.user.loggedin })
    },
    editName: async (req, res) => {
        const userId = req.session.user.id
        const { fname, lname } = req.body
        const status = await UserModel.updateOne({ _id: userId }, { firstname: fname, lastname: lname })
        if (status.modifiedCount == 1) {
            res.status(200).send("success")
        } else {
            res.status(400).send("Something wrong")
        }
    },
    editMobile: async (req, res) => {
        const userId = req.session.user.id
        const { mobile } = req.body
        const status = await UserModel.updateOne({ _id: userId }, { mobile: mobile })
        if (status.modifiedCount == 1) {
            res.status(200).send("success")
        } else {
            res.status(400).send("Something wrong")
        }
    },
    editEmail: async (req, res) => {
        const userId = req.session.user.id
        const { email, OTP } = req.body
        if (OTP) {
            if (email === req.session.user.newEmail && OTP === req.session.user.otp) {
                const status = await UserModel.updateOne({ _id: userId }, { email: email })
                if (status.modifiedCount == 1) {
                    res.status(200).send("success")
                } else {
                    res.status(400).send("Something wrong")
                }
            } else {
                res.status(200).send("Invalid Otp")
            }
        } else {
            const otp = generateOTP()
            console.log('------------------------', otp)
            req.session.user.otp = otp
            req.session.user.newEmail = email
            console.log(req.session.user)
            const status = await sendOTP(email, otp)
            res.status(200).send({ newEmail: email, msg: 'otpSend' })
        }
    },
    addToWishlist: async (req, res) => {
        const userId = req.session.user.id
        const prodId = req.params.id
        const status = await UserModel.updateOne({ _id: userId }, {
            $addToSet:
            {
                wishlist: prodId
            }
        })
    },
    showWishlist: async (req, res) => {
        const userId = req.session.user.id
        const products = await productHelper.getProductsFromWishlist(userId)
        res.render('wishlist', { products })
    },
    removeFromWishlist: async (req, res) => {
        const userId = req.session.user.id
        const prodId = req.params.id
        const status = await UserModel.updateOne({ _id: userId }, {
            $pull: { wishlist: prodId }
        })
        if (status.modifiedCount === 1) {
            res.status(200).send('Removed')
        } else {
            res.status(400).send('something wrong')
        }
    },
    deleteAddress: async (req, res) => {
        const userId = req.session.user.id
        const { addressId } = req.body
        const status = await UserModel.updateOne({ _id: userId },
            { $pull: { address: { _id: addressId } } })
        if (status.modifiedCount === 1) res.status(200).send('deleted')
        else res.status(400).send("something wrong")
    },
    verifyPayment: async (req, res) => {
        let action = 'placed'
        const paymentDetails = req.body
        const orderId = paymentDetails['rzpOrder[receipt]']
        const paymentId = paymentDetails['payment[razorpay_payment_id]']
        const paymentStatus = await userHelper.verifyPayment(paymentDetails)
        if (paymentStatus) {
            const status = await orderHelper.updateStatus(orderId, paymentId, action)  //rzpOrder[receipt] is orderId
            console.log("🚀 ~ file: userController.js:282 ~ verifyPayment: ~ status:", status)
            res.status(200).send("Ordre placed successfully")
        } else {
            const status = await orderHelper.updateStatus(orderId, paymentId, 'failed')  //rzpOrder[receipt] is orderId
            console.log("🚀 ~ file: userController.js:285 ~ verifyPayment: ~ status:", status)

        }
    }
}

export default userController