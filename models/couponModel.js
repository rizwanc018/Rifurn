import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code : {
        type: String,
        required: true
    },
    count: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
})

const couponModel = mongoose.model('Coupon', couponSchema)
export default couponModel