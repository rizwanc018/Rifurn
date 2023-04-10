import orderHelper from "../helpers/orderHelper.js";

const orderController = {
    getUserOrders: async (req, res) => {
        const userId = req.session.user.id
        const orderData = await orderHelper.getUserOrders(userId)
        orderData.forEach(order => {
            order.createdAt =  new Date(order.createdAt).toLocaleDateString()
        })
        res.render('orders', { orderData, isUserLoggedin: req.session.user?.loggedin, })
    }
}

export default orderController