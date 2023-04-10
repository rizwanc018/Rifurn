import mongoose from "mongoose";
import orderModel from "../models/orderModel.js";


const orderHelper = {
    createOrder: async (userId, cartData, address, mobile) => {
        const status = await orderModel.create({
            userId: userId,
            items: cartData,
            address: address,
            contact: mobile
        })
        return status
    },
    getUserOrders: async (userId) => {
        const userOrders = await orderModel.aggregate([
            {
                $match: { userId: new mongoose.Types.ObjectId(userId) }
            },
            {
                $unwind: '$items'
            },
            {
                $lookup: {
                    from: "products",
                    localField: 'items.productId',
                    foreignField: '_id',
                    as: "result"
                }
            },
            {
                $unwind: '$result'
            },
            {
                $project: {
                    createdAt: 1,
                    image: { $first: "$result.images" },
                    "result.productName": 1,
                    "items.quantity": 1,
                    orderStatus: 1,
                    "items.productId": 1
                }
            }
        ])
        console.log("🚀 ~ file: orderHelper.js:47 ~ getUserOrders: ~ userOrders:", userOrders)
        return userOrders
    }

}

export default orderHelper