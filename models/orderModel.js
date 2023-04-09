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
    Items: [itemSchema],
    orderStatus: {
        type: String,
        default: "pending"
    },
    address: Object,
    contact: Number,
    paymenMode: String
},
    {
        timestamps: true
    }
)

const orderModel = mongoose.model('Order', orderSchema)
export default orderModel