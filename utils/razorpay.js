import Razorpay from 'razorpay';
import * as dotenv from 'dotenv'
dotenv.config()

const instance = new Razorpay({
    key_id: process.env.RZP_KEY_ID,
    key_secret: process.env.RZP_KEY_SECRET,
});

export default instance