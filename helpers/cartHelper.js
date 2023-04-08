import cartModel from "../models/cartModel.js";
import productHelper from "./productHelpers.js";


const cartHelper = {
    updateCart: async (userId, productId, quantity = 1) => {
        const productQuantity = await productHelper.getProductQuantity(productId)
        if (productQuantity > quantity) {
            const status = await cartModel.updateOne(
                { userId: userId, productId, productId },
                { userId: userId, productId: productId, $inc: { quantity: quantity } },
                { upsert: true }
            )
            productHelper.updateProductQuantity(productId, quantity)
            return status
        } else {
            return "Out of Stock"
        }
    }

}

export default cartHelper