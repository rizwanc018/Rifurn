import cartModel from "../models/cartModel.js";

const cartHelper = {
    updateCart: async (userId, productId, quantity = 1) => {
        const status = await cartModel.updateOne(
            { userId: userId, productId, productId },
            { userId: userId, productId: productId, $inc: { quantity: quantity } },
            { upsert: true }
        )
        return status
    }

}

export default cartHelper