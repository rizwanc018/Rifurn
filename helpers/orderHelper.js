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
                $project: {
                    orderId: '$_id',
                    user: '$user.firstname',
                    email: '$user.email',
                    mobile: '$contact',
                    address: '$address',
                    product: '$result.productName',
                    productId: '$items.productId',
                    qty: '$items.quantity',
                    orderStatus: '$items.orderStatus',
                    paymentId: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ])
        // console.log('🚀 ~ file: orderHelper.js:12 ~ orders:', orders)
        return orders
    },
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
                $project: {
                    createdAt: 1,
                    image: { $first: '$result.images' },
                    'result.productName': 1,
                    'items.quantity': 1,
                    'items.orderStatus': 1,
                    'items.productId': 1
                }
            }
        ])
        console.log('🚀 ~ file: orderHelper.js:47 ~ getUserOrders: ~ userOrders:', userOrders)
        return userOrders
    },
    updateStatus: async (orderId, prodId, action) => {
        const status = await orderModel.updateOne(
            { _id: orderId, items: { $elemMatch: { productId: prodId } } },
            {
                $set: { 'items.$.orderStatus': action }
            })
        return status
    }

}

export default orderHelper