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
    getCartData: async (userId) => {
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
    },
    // getSingleProductDataFromCart: async (userId, productId) => {
    //     const productData = await cartModel.aggregate([
    //         {
    //             $match: {
    //                 userId: new mongoose.Types.ObjectId(userId),
    //                 productId: new mongoose.Types.ObjectId(productId)
    //             }
    //         },
    //         {
    //             $lookup: {
    //                 from: "products",
    //                 localField: 'productId',
    //                 foreignField: '_id',
    //                 as: "result"
    //             }
    //         },
    //         {
    //             $unwind: "$result"
    //         },
    //         {
    //             $project: {
    //                 productId: "$result._id",
    //                 product: "$result.productName",
    //                 image: { $first: "$result.images" },
    //                 price: "$result.price",
    //                 "quantity": 1,
    //                 subTotal: { $multiply: ["$result.price", "$quantity"] }
    //             }
    //         }
    //     ])
    //     return productData
    // },
    // getGrandTotal: async (userId) => {
    //     const getGrandTotal = await cartModel.aggregate([
    //         {
    //             $match: { userId: new mongoose.Types.ObjectId(userId) }
    //         },
    //         {
    //             $lookup: {
    //                 from: "products",
    //                 localField: 'productId',
    //                 foreignField: '_id',
    //                 as: "result"
    //             }
    //         },
    //         {
    //             $unwind: "$result"
    //         },
    //         {
    //             $project: {
    //                 subTotal: { $multiply: ["$result.price", "$quantity"] }
    //             }
    //         },
    //         {
    //             $group: {
    //                 _id: null,
    //                 grandTotal: {$sum : '$subTotal'}
    //             }
    //         }
    //     ])
    // },
    deleteItemfromCart: async (cartId) => {
        const data = await cartModel.findByIdAndDelete(cartId)
        return data
    },
    getItemsAndDeleteCart: async (userId) => {
        const data = await cartModel.find({ userId: userId }, { _id: 0, productId: 1, quantity: 1 })
        // const deleteCartStatus = await cartModel.deleteMany({userId: userId})
        return data
    }
}

export default cartHelper