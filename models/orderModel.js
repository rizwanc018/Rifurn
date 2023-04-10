import mongoose from "mongoose"

const itemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    quantity: Number,
    orderStatus: {
        type: String,
        default: "placed"
    },
})

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    items: [itemSchema],
    address: Object,
    contact: Number,
    paymentMode: String,
    paymentId: {
        type: String,
        default: "COD"
    },
},
    {
        timestamps: true
    }
)

const orderModel = mongoose.model('Order', orderSchema)
export default orderModel