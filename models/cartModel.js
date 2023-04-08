import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    price: Number,
    quantity: Number
},
    {
        timestamps: true
    }
)

const cartModel = mongoose.model('Cart', cartSchema)
export default cartModel


// -------------------------------
// import mongoose from "mongoose";

// const cartSchema = new mongoose.Schema({
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User"
//     },
//     productId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Product"
//     },
//     price: Number,
//     quantity: Number
// },
//     {
//         timestamps: true
//     }
// )

// const cartModel = mongoose.model('Cart', cartSchema)
// export default cartModel