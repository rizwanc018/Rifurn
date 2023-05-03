import mongoose from 'mongoose';
import orderModel from '../models/orderModel.js';


const orderHelper = {
    getAllOrders: async () => {
        try {
            const orders = await orderModel.aggregate([
                {
                    $match: { _id: { $exists: true } }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $unwind: '$user'
                },
                {
                    $sort: { updatedAt: -1 }
                }
            ])
            return orders
        } catch (error) {
            console.log("🚀 ~ file: orderHelper.js:29 ~ getAllOrders: ~ error:", error)
        }
    },
    createOrder: async (userId, cartData, address, discount, paymentId, action) => {
        try {
            const status = await orderModel.create({
                userId: userId,
                items: cartData,
                address: address,
                discount: discount,
                orderStatus: action,
                paymentId: paymentId
            })
            return status
        } catch (error) {
            console.log("🚀 ~ file: orderHelper.js:44 ~ createOrder: ~ error:", error)
        }
    },
    getUserOrders: async (userId) => {
        try {
            const userOrders = await orderModel.aggregate([
                {
                    $match: { userId: new mongoose.Types.ObjectId(userId) }
                },
                {
                    $unwind: '$items'
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'items.productId',
                        foreignField: '_id',
                        as: 'result'
                    }
                },
                {
                    $unwind: '$result'
                },
                {
                    $sort: { updatedAt: -1 }
                }
            ])
            return userOrders
        } catch (error) {
            console.log("🚀 ~ file: orderHelper.js:73 ~ getUserOrders: ~ error:", error)
        }
    },
    updateStatus: async (orderId, action, returnReason = "") => {
        try {
            if (returnReason) {
                const status = await orderModel.updateOne(
                    { _id: orderId },
                    {
                        orderStatus: action,
                        returnReason: returnReason
                    })
                return status
            } else {

                const status = await orderModel.updateOne(
                    { _id: orderId },
                    {
                        orderStatus: action
                    })
                return status
            }
        } catch (error) {
            console.log("🚀 ~ file: orderHelper.js:96 ~ updateStatus: ~ error:", error)
        }

    },
    updateStatusAndPaymentId: async (orderId, paymentId, action) => {
        try {
            const status = await orderModel.updateOne(
                { _id: orderId },
                {
                    orderStatus: action,
                    paymentId: paymentId
                })
            return status
        } catch (error) {
            console.log("🚀 ~ file: orderHelper.js:110 ~ updateStatusAndPaymentId: ~ error:", error)
        }
    },
    getSingleOrderdetails: async (orderId) => {
        try {
            const orderDetails = await orderModel.aggregate([
                {
                    $match: { _id: new mongoose.Types.ObjectId(orderId) }
                },
                {
                    $unwind: '$items'
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'items.productId',
                        foreignField: '_id',
                        as: 'result'
                    }
                },
                {
                    $project: {
                        address: 1,
                        paymentId: 1,
                        createdAt: 1,
                        discount: 1,
                        quantity: '$items.quantity',
                        productName: "$result.productName",
                        orderStatus: 1,
                        price: { $arrayElemAt: ["$result.price", 0] },
                        amount: { $multiply: ['$items.quantity', { $arrayElemAt: ["$result.price", 0] }] },
                        image: { $first: "$result.images" },
                        returnReason: 1
                    }
                }
            ])
            return orderDetails
        } catch (error) {
            console.log("🚀 ~ file: orderHelper.js:148 ~ getSingleOrderdetails: ~ error:", error)
        }
    },
    getTotal: async (orderId) => {
        try {
            const total = await orderModel.aggregate([
                {
                    $match: { _id: new mongoose.Types.ObjectId(orderId) }
                },
                {
                    $unwind: '$items'
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'items.productId',
                        foreignField: '_id',
                        as: 'result'
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: { $multiply: ['$items.quantity', { $arrayElemAt: ["$result.price", 0] }] } },
                    }
                },
                {
                    $project: {
                        _id: 0,
                        total: 1
                    }
                }
            ])
            return total
        } catch (error) {
            console.log("🚀 ~ file: orderHelper.js:183 ~ getTotal: ~ error:", error)
        }
    },

}

export default orderHelper