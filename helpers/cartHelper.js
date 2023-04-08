import cartModel from "../models/cartModel.js";
import productHelper from "./productHelpers.js";
import mongoose from "mongoose";



const cartHelper = {
    updateCart: async (userId, productId, quantity = 1) => {
        const productQuantity = await productHelper.getProductQuantity(productId)
        if (productQuantity > quantity) {
            const status = await cartModel.updateOne(
                { userId: userId, productId: productId },
                { userId: userId, productId: productId, $inc: { quantity: quantity } },
                { upsert: true }
            )
            productHelper.updateProductQuantity(productId, quantity)
            return status
        } else {
            return "Out of Stock"
        }
    },
    showCart: async (userId) => {
        const cartItems = await cartModel.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: "products",
                    localField: 'productId',
                    foreignField: '_id',
                    as: "result"
                }
            },
            {
                $unwind: "$result"
            },
            {
                $project: {
                    product: "$result.productName",
                    image:{$first: "$result.images"},
                    price: "$result.price",
                    "quantity": 1,
                    subTotal: {$multiply : ["$result.price", "$quantity"]}
                }
            }
        ])
        return cartItems
    }

}

export default cartHelper