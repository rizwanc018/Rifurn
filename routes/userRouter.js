import express from 'express';
import userController from '../controllers/userController.js';
import { isUserLoggedin } from '../middlewares/userMiddlewares.js';
import cartController from '../controllers/cartController.js';
import orderController from '../controllers/orderController.js';
// import upload from "../utils/multer.js";
import multer from "multer";
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

userRouter.post('/addtocart', isUserLoggedin, cartController.addtoCart)
userRouter.get('/cart', isUserLoggedin, cartController.showCart)

userRouter.get('/add/wishlist/:id', isUserLoggedin, userController.addToWishlist)
userRouter.get('/wishlist', isUserLoggedin, userController.showWishlist)
userRouter.delete('/delete/wishlist/:id', isUserLoggedin, userController.removeFromWishlist)


userRouter.post('/change/product/quantity', cartController.changeQuantity)
userRouter.delete('/cart/item/delete', cartController.deleteItemfromCart)

userRouter.get('/checkout', isUserLoggedin, userController.showCheckoutPage)
userRouter.post('/placeorder',isUserLoggedin, upload.none(), userController.placeOrder)

userRouter.get('/orders', isUserLoggedin, orderController.getUserOrders)
userRouter.post('/cancel/order', isUserLoggedin, userController.cancelOrder)

userRouter.get('/profile',isUserLoggedin, userController.showProfilePage)

userRouter.put('/edit/name', isUserLoggedin, userController.editName)
userRouter.put('/edit/mobile', isUserLoggedin, userController.editMobile)
userRouter.put('/edit/email', isUserLoggedin, userController.editEmail)



export default userRouter;