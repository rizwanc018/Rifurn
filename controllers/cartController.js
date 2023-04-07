import cartHelper from "../helpers/cartHelper.js"

const cartController = {
    addtoCart: async (req, res) => {
        const userId = req.session.user.id
        const productId = req.body.productId
        const status = await cartHelper.updateCart(userId, productId)
        if(status.upsertedCount === 0) {
            res.status(200).send("Added to cart")
        }        
    }
}

export default cartController