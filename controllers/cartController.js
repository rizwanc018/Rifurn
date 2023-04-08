import cartHelper from "../helpers/cartHelper.js"

const cartController = {
    addtoCart: async (req, res) => {
        const userId = req.session.user.id
        const productId = req.body.productId
        const status = await cartHelper.updateCart(userId, productId)
        console.log("🚀 ~ file: cartController.js:8 ~ addtoCart: ~ status:", status)
        if (status.upsertedCount === 1 || status.modifiedCount === 1) {
            res.status(200).send("Product added to cart")
        } else {
            res.status(200).send("Out of stock")
        }
    }
}

export default cartController