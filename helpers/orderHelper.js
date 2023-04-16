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
            // {
            //     $unwind: '$items'
            // },
            // {
            //     $lookup: {
            //         from: 'products',
            //         localField: 'items.productId',
            //         foreignField: '_id',
            //         as: 'result'
            //     }
            // },
            // {
            //     $unwind: '$result'
            // },
            // {
            //     $project: {
            //         orderId: '$_id',
            //         user: '$user.firstname',
            //         email: '$user.email',
            //         mobile: '$contact',
            //         address: '$address',
            //         product: '$result.productName',
            //         productId: '$items.productId',
            //         qty: '$items.quantity',
            //         orderStatus: '$items.orderStatus',
            //         paymentId: 1,
            //         createdAt: 1,
            //         updatedAt: 1
            //     }
            // }
        ])
        return orders
    },
    createOrder: async (userId, cartData, address, discount) => {
        const status = await orderModel.create({
            userId: userId,
            items: cartData,
            address: address,
            discount: discount
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
    updateStatus: async (orderId, action) => {
        const status = await orderModel.updateOne(
            { _id: orderId },
            {
                orderStatus: action
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
                    price: "$result.price",
                    orderStatus: 1,
                    //         // amount: {$multiply : ['$items.quantity', "$result.price.0"]},
                    image: { $first: "$result.images" },
                }
            }
            // {
            //     $unwind: '$result'
            // },
        ])
        console.log("🚀 ~ file: orderHelper.js:136 ~ getSingleOrderdetails: ~ orderDetails:", orderDetails)
        return orderDetails
    }

}

export default orderHelper