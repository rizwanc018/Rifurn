import express from 'express';
import { sendOTP, verifyOTP } from "../controllers/twilioController.js";

const router = express.Router()

router.route('/sendotp').post(sendOTP)
// router.route('/verifyotp').post(verifyOTP)
router.post('/verifyotp', verifyOTP)

export default router