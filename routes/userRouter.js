import express from 'express';
import userController from '../controllers/userController.js';
import { isUserLoggedin } from '../middlewares/userMiddlewares.js';
import cartController from '../controllers/cartController.js';
import orderController from '../controllers/orderController.js';
import multer from "multer";
import couponController from '../controllers/couponContoller.js';
import cartHelper from '../helpers/cartHelper.js';
import walletHelper from '../helpers/walletHelper.js';
const upload = multer()

const userRouter = express.Router()

userRouter.get('/resendotp', userController.reSendOtp)
userRouter.post('/signup', userController.doSignup)
userRouter.post('/verifyotp', userController.doOTPVerification)
userRouter.post('/login', userController.doPasswordLogin)
userRouter.get('/logout', userController.doLogOut)
// userRouter.post('/otplogin/verification', userController.doOTPVerificationForLogin)
userRouter.post('/forgotpassword', userController.forgotPassword)
userRouter.post('/forgotpassword/verifyotp', userController.doOTPVerificationForPasswordChange)
userRouter.post('/changepassword', userController.changePassword)
userRouter.get('/getAddress', userController.getCurrentLocation)
userRouter.delete('/delete/address', userController.deleteAddress)

userRouter.post('/addtocart', isUserLoggedin, cartController.addtoCart)
userRouter.get('/cart', isUserLoggedin, cartController.showCart)

userRouter.get('/add/wishlist/:id', isUserLoggedin, userController.addToWishlist)
userRouter.get('/wishlist', isUserLoggedin, userController.showWishlist)
userRouter.delete('/delete/wishlist/:id', isUserLoggedin, userController.removeFromWishlist)

userRouter.post('/change/product/quantity', cartController.changeQuantity)
userRouter.delete('/cart/item/delete', cartController.deleteItemfromCart)

userRouter.get('/checkout', isUserLoggedin, userController.showCheckoutPage)
userRouter.post('/placeorder',isUserLoggedin, upload.none(), userController.placeOrder)

userRouter.post('/verifypayment', userController.verifyPayment)

userRouter.get('/orders', isUserLoggedin, orderController.getUserOrders)
userRouter.post('/order/details', isUserLoggedin, orderController.getSingleOrderdetails)
userRouter.post('/cancel/order', isUserLoggedin, userController.cancelOrder)

userRouter.post('/return/order', isUserLoggedin, userController.returnOrder)

userRouter.get('/profile',isUserLoggedin, userController.showProfilePage)
userRouter.put('/edit/name', isUserLoggedin, userController.editName)
userRouter.put('/edit/mobile', isUserLoggedin, userController.editMobile)
userRouter.put('/edit/email', isUserLoggedin, userController.editEmail)
userRouter.post('/address/save', isUserLoggedin, upload.none(), userController.saveAddress)

userRouter.post('/apply/coupon',isUserLoggedin, couponController.applyCoupon)

userRouter.get('/wallet', isUserLoggedin, walletHelper.getWalletData)


// userRouter.get('/tst', isUserLoggedin, async (req, res) => {
//     const userId = req.session.user.id
//     console.log("🚀 ~ file: userRouter.js:52 ~ userRouter.get ~ userId:", userId)
//     await cartHelper.getTotalFromCart(userId)
//     res.send("YES")
    
// })

export default userRouter;