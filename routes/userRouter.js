import express from 'express';
import userController from '../controllers/userController.js';
import { isUserLoggedin } from '../middlewares/userMiddlewares.js';
import cartController from '../controllers/cartController.js';

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

userRouter.post('/change/product/quantity', cartController.changeQuantity)
userRouter.delete('/cart/item/delete', cartController.deleteItemfromCart)

userRouter.get('/checkout', isUserLoggedin, userController.showCheckoutPage)
userRouter.post('/placeorder', userController.placeOrder)

export default userRouter;