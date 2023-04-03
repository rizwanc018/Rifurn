import express from 'express';
import userController from '../controllers/userController.js';

const userRouter = express.Router()

userRouter.get('/resendotp', userController.reSendOtp)
userRouter.post('/signup', userController.doSignup)
userRouter.post('/verifyotp', userController.doOTPVerification)
userRouter.post('/login', userController.doPasswordLogin)
userRouter.post('/otplogin/verification', userController.doOTPVerificationForLogin)
userRouter.post('/forgotpassword', userController.forgotPassword)
userRouter.post('/forgotpassword/verifyotp', userController.verifyOTP)
userRouter.post('/changepassword', userController.changePassword)

export default userRouter;