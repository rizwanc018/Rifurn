import cartHelper from "../helpers/cartHelper.js"
import productHelper from "../helpers/productHelpers.js"

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
        console.log("🚀 ~ file: cartController.js:17 ~ showCart: ~ cartItems:", cartItems)
        const total = cartItems.reduce((total, item) => {
            return total + item.subTotal
        }, 0)
        res.render('cart', { cartItems, isUserLoggedin: req.session.user?.loggedin, total: total })
    },
    changeQuantity: async (req, res) => {
        const userId = req.session.user.id
        const productId = req.body.productId
        const qty = req.body.quantity
        const status = await cartHelper.updateCart(userId, productId, qty)
        if (status.upsertedCount === 1 || status.modifiedCount === 1) {
            const cartItems = await cartHelper.getCartData(userId)
            const [item] = cartItems.filter(item => {
                return item.productId == productId
            })
            const total = cartItems.reduce((total, item) => {
                return total + item.subTotal
            }, 0)
            res.status(200).send({ item, total })
        }
    },
    deleteItemfromCart: async (req, res) => {
        const cartId = req.body.cartId
        const data = await cartHelper.deleteItemfromCart(cartId)
        const productId = data.productId
        const quantity = data.quantity * -1  // Multipin by -1,  to use it in (productHelper.updateProductQuantity())
        const status = await productHelper.updateProductQuantity(productId, quantity)
        res.status(200).send("Removed Item Successfully")
    }
}

export default cartController