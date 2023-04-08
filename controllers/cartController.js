import cartHelper from "../helpers/cartHelper.js"

const cartController = {
    addtoCart: async (req, res) => {
        const userId = req.session.user.id
        const productId = req.body.productId
        const status = await cartHelper.updateCart(userId, productId)
        if (status.upsertedCount === 1 || status.modifiedCount === 1) {
            res.status(200).send("Product added to cart")
        } else {
            res.status(200).send("Out of stock")
        }
    },
    showCart: async (req, res) => {
        const userId = req.session.user.id
        const cartItems = await cartHelper.showCart(userId)
        const total = cartItems.reduce((total, item) => {
            return total + item.subTotal
        }, 0)        
        res.render('cart', { cartItems, isUserLoggedin: req.session.user?.loggedin, total: total })
    }
}

export default cartController