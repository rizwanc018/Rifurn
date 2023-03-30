import express from 'express';
import userController from '../controllers/userController.js';

const userRouter = express.Router()

userRouter.post('/signup', userController.doSignup)
userRouter.post('/verifyotp', userController.doOTPVerification)
userRouter.post('/otplogin', userController.doOTPLogin)
userRouter.post('/otplogin/verification', userController.doOTPVerificationForLogin)

export default userRouter;