import userHelper from "../helpers/userHelper.js";
import { sendOTP } from "../services/mailer.js";
import generateOTP from "../services/otp.js";
import bcrypt from "bcrypt";
import UserModel from "../models/userModel.js";
import productHelper from "../helpers/productHelpers.js";
import cartHelper from "../helpers/cartHelper.js";
import orderHelper from "../helpers/orderHelper.js";
import couponModel from "../models/couponModel.js";
import walletHelper from "../helpers/walletHelper.js";
import axios from 'axios';
import { config } from 'dotenv';

config();
// require('dotenv').config();

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
            res.redirect('/user/cart')
            return
        }
        res.render('checkout', { cartItems, total, userData, discount, grandTotal })
    },
    placeOrder: async (req, res) => {
        const userId = req.session.user.id
        const discount = req.session.user.discount || 0
        const couponCode = req.session.user.couponCode
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
        req.session.user.address = address
        if (saveAddress == 'true') {
            const updateAddressStatus = await userHelper.updateAddress(userId, address)
        }
        if (paymentMethod === 'COD') {
            const cartData = await cartHelper.getItemsAndDeleteCart(userId)
            const orderdata = await orderHelper.createOrder(userId, cartData, address, discount)
            // let total = await orderHelper.getTotal(orderdata._id)   // total: [ { total: 6200 } ]
            res.status(200).send({ codSuccess: true, msg: 'Order Placed Successfully', orderId: orderdata._id })
        } else if (paymentMethod === 'payOnline') {
            let total = await cartHelper.getTotalFromCart(userId)   // total: [ { total: 6200 } ]
            total = total[0].grandTotal - discount
            const rzpOrder = await userHelper.generateRazorpay(total)
            res.status(200).send({ payment: "rzPay", rzpOrder })
        } else if (paymentMethod === 'wallet') {
            try {
                const walletBalance = await walletHelper.getWalletBalance(userId)
                let total = await cartHelper.getTotalFromCart(userId)   // total: [ { total: 6200 } ]
                total = total[0].grandTotal - discount
                if (total <= walletBalance) {
                    const cartData = await cartHelper.getItemsAndDeleteCart(userId)
                    const orderdata = await orderHelper.createOrder(userId, cartData, address, discount, 'wallet')
                    const status = await walletHelper.updateWallet(userId, total * -1, 'buy')
                    if (status.modifiedCount === 1) {
                        res.status(200).send({ walletSuccess: true, msg: 'Order Placed Successfully', orderId: orderdata._id })
                    }
                }
            } catch (error) {
                res.status(200).send({ noWallet: true, msg: 'No wallet found / Not enough balance' })
            }
        }
    },
    cancelOrder: async (req, res) => {
        const { orderId } = req.body
        const status = await orderHelper.updateStatus(orderId, "cancelled")
        res.status(200).send("Order Cancelled")
    },
    returnOrder: async (req, res) => {
        const { orderId, returnReason } = req.body
        const status = await orderHelper.updateStatus(orderId, "returned", returnReason)
        res.status(200).send("Order returned")
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
    saveAddress: async (req, res) => {
        const userId = req.session.user.id
        let { firstname, lastname, mobile, addr1, addr2, country, town, state, zip } = req.body
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
        const response = await userHelper.updateAddress(userId, address)
        if (response) {
            res.status(200).send(response.address.pop())
        } else {
            res.status(400).send("Something wrong")
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
        const userId = req.session.user.id
        let action = 'placed'
        const paymentDetails = req.body
        const paymentId = paymentDetails['payment[razorpay_payment_id]']
        const address = req.session.user.address
        const paymentStatus = await userHelper.verifyPayment(paymentDetails)
        const discount = req.session.user.discount || 0
        if (paymentStatus) {
            const cartData = await cartHelper.getItemsAndDeleteCart(userId)
            const orderdata = await orderHelper.createOrder(userId, cartData, address, discount, paymentId, action)
            const response = await couponModel.updateOne({ code: req.session.user.couponCode },
                { $push: { users: userId }, $inc: { count: -1 } })
            req.session.user.discount = 0
            req.session.user.couponCode = ""
            res.status(200).send(orderdata._id)
        } else {
            res.status(400).send("Payment Failed")
        }
    },
    getCurrentLocation: async (req, res) => {
        const { lat, lng } = req.query;
        const accessToken = process.env.MAPBOX_API_KEY;
        console.log(lat, lng, accessToken)

        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
            const address = response.data.address;
            res.send(address);
        } catch (error) {
            res.status(500).send({ error: 'Error fetching address' });
        }
    }
}

export default userController