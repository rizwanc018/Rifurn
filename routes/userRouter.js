import express from 'express';
import userController from '../controllers/userController.js';

const userRouter = express.Router()

userRouter.get('/resendotp', userController.reSendOtp)
userRouter.post('/signup', userController.doSignup)
userRouter.post('/verifyotp', userController.doOTPVerification)
userRouter.post('/login', userController.doPasswordLogin)
userRouter.post('/otplogin', userController.doOTPLogin)
userRouter.post('/otplogin/verification', userController.doOTPVerificationForLogin)

export default userRouter;