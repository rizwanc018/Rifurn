import mongoose from "mongoose"

const itemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    quantity: Number
})

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    items: [itemSchema],
    orderStatus: {
        type: String,
        default: "placed"
    },
    address: Object,
    contact: Number,
    paymentMode: String,
    paymentId: String,
},
    {
        timestamps: true
    }
)

const orderModel = mongoose.model('Order', orderSchema)
export default orderModel