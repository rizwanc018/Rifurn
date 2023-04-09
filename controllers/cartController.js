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
        const cartItems = await cartHelper.getCartData(userId)
        const total = cartItems.reduce((total, item) => {
            return total + item.subTotal
        }, 0)
        res.render('cart', { cartItems, isUserLoggedin: req.session.user?.loggedin, total: total })
    },
    changeQuantity: async (req, res) => {
        const userId = req.session.user.id
        const productId = req.body.productId
        console.log("🚀 ~ file: cartController.js:25 ~ changeQuantity: ~ productId:", productId)
        const qty = req.body.quantity
        const status = await cartHelper.updateCart(userId, productId, qty)
        if (status.upsertedCount === 1 || status.modifiedCount === 1) {
            // const [data] = await cartHelper.getSingleProductDataFromCart(userId, productId)
            // await cartHelper.getGrandTotal(userId)
            const cartItems = await cartHelper.getCartData(userId)
            const [item] = cartItems.filter(item => {
                return item.productId == productId
            })
            const total = cartItems.reduce((total, item) => {
                return total + item.subTotal
            }, 0)
            res.status(200).send({item, total})
        }
    }
}

export default cartController