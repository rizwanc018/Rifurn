import mongoose from 'mongoose';
import orderModel from '../models/orderModel.js';


const orderHelper = {
    getAllOrders: async () => {
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
    },
    createOrder: async (userId, cartData, address, discount, paymentId, action) => {
        const status = await orderModel.create({
            userId: userId,
            items: cartData,
            address: address,
            discount: discount,
            orderStatus: action,
            paymentId: paymentId
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
            // {
            //     $project: {
            //         createdAt: 1,
            //         orderId: '$_id',
            //         orderStatus: 1,
            //         'result.price': 1,
            //     }
            // }
        ])
        return userOrders
    },
    updateStatus: async (orderId, action, returnReason = "") => {
        console.log("🚀 ~ file: orderHelper.js:73 ~ updateStatus: ~ returnReason:", returnReason)
        console.log("🚀 ~ file: orderHelper.js:73 ~ updateStatus: ~ action:", action)
        console.log("🚀 ~ file: orderHelper.js:73 ~ updateStatus: ~ orderId:", orderId)
        if (returnReason) {
            console.log('Return reason is trueeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
            const status = await orderModel.updateOne(
                { _id: orderId },
                {
                    orderStatus: action,
                    returnReason: returnReason
                })
            console.log("🚀 ~ file: orderHelper.js:84 ~ updateStatus: ~ status:", status)
            return status
        } else {
            console.log('Return reason is FALSEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEe');

            const status = await orderModel.updateOne(
                { _id: orderId },
                {
                    orderStatus: action
                })
            return status
        }
    },
    updateStatusAndPaymentId: async (orderId, paymentId, action) => {
        const status = await orderModel.updateOne(
            { _id: orderId },
            {
                orderStatus: action,
                paymentId: paymentId
            })
        return status
    },
    getSingleOrderdetails: async (orderId) => {
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
    },
    getTotal: async (orderId) => {
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
    },

}

export default orderHelper