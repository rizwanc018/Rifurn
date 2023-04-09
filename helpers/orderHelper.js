import orderModel from "../models/orderModel.js";

const orderHelper = {
    createOrder: async (userId, cartData, address, mobile) => {
        const status = await orderModel.create({
            userId: userId,
            Items: cartData,
            address: address,
            contact: mobile
        })
        return status
    }
}

export default orderHelper