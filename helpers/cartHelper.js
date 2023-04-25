import cartModel from "../models/cartModel.js";
import productHelper from "./productHelpers.js";
import mongoose from "mongoose";



const cartHelper = {
    updateCart: async (userId, productId, quantity = 1) => {
        try {
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
        } catch (error) {
            console.log("🚀 ~ file: cartHelper.js:23 ~ updateCart: ~ error:", error)
        }
    },
    getCartData: async (userId) => {
        try {            
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
                        productId: "$result._id",
                        product: "$result.productName",
                        image: { $first: "$result.images" },
                        price: "$result.price",
                        "quantity": 1,
                        subTotal: { $multiply: ["$result.price", "$quantity"] }
                    }
                }
            ])
            return cartItems
        } catch (error) {
            console.log("🚀 ~ file: cartHelper.js:54 ~ getCartData: ~ error:", error)
        }
    },
    getTotalFromCart: async (userId) => {
        try {
            const total = await cartModel.aggregate([
                {
                    $match: { userId: new mongoose.Types.ObjectId(userId) }
                },
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
                        subTotal: { $multiply: ["$result.price", "$quantity"] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        grandTotal: { $sum: '$subTotal' }
                    }
                }
            ])
            return total
        } catch (error) {
            console.log("🚀 ~ file: cartHelper.js:88 ~ getTotalFromCart: ~ error:", error)
        }
    },
    deleteItemfromCart: async (cartId) => {
        try {            
            const data = await cartModel.findByIdAndDelete(cartId)
            return data
        } catch (error) {
            console.log("🚀 ~ file: cartHelper.js:95 ~ deleteItemfromCart: ~ error:", error)  
        }
    },
    getItemsAndDeleteCart: async (userId) => {
        try {            
            const data = await cartModel.find({ userId: userId }, { _id: 0, productId: 1, quantity: 1 })
            const deleteCartStatus = await cartModel.deleteMany({ userId: userId })
            return data
        } catch (error) {
            console.log("🚀 ~ file: cartHelper.js:103 ~ getItemsAndDeleteCart: ~ error:", error)
        }
    }
}

export default cartHelper