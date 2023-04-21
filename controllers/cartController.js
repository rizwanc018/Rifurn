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
        console.log("🚀 ~ file: cartController.js:18 ~ showCart: ~ req.session.user:", req.session.user)
        const userId = req.session.user.id
        const discount = req.session.user.discount || 0
        const cartItems = await cartHelper.getCartData(userId)
        const total = cartItems.reduce((total, item) => {
            return total + item.subTotal
        }, 0)
        const grandTotal = total - discount
        res.render('cart', { cartItems, isUserLoggedin: req.session.user?.loggedin, total: total, discount, grandTotal })
    },
    changeQuantity: async (req, res) => {
        const userId = req.session.user.id
        const productId = req.body.productId
        const qty = req.body.quantity
        const discount = req.session.user.discount || 0
        const status = await cartHelper.updateCart(userId, productId, qty)
        if (status.upsertedCount === 1 || status.modifiedCount === 1) {
            const cartItems = await cartHelper.getCartData(userId)
            const [item] = cartItems.filter(item => {
                return item.productId == productId
            })
            const total = cartItems.reduce((total, item) => {
                return total + item.subTotal
            }, 0)
            res.status(200).send({ item, total, discount })
        }
    },
    deleteItemfromCart: async (req, res) => {
        const cartId = req.body.cartId
        const discount = req.session.user.discount || 0
        const data = await cartHelper.deleteItemfromCart(cartId)
        const productId = data.productId
        const quantity = data.quantity * -1  // Multipin by -1,  to use it in (productHelper.updateProductQuantity())
        const status = await productHelper.updateProductQuantity(productId, quantity)
        res.status(200).send({ discount, msg: "Removed Item Successfully" })
    }
}

export default cartController