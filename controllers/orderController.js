import orderHelper from "../helpers/orderHelper.js";

const orderController = {
    getAllOrders: async (req, res) => {
        const orders = await orderHelper.getAllOrders()
        orders.forEach(order => {
            order.createdAt = new Date(order.createdAt).toLocaleDateString()
            order.updatedAt = new Date(order.updatedAt).toLocaleDateString()
        })
        res.render('admin/orders', { orders, isAdmin: req.session.isAdmin })
    },
    getUserOrders: async (req, res) => {
        const userId = req.session.user.id
        const orderData = await orderHelper.getUserOrders(userId)
        orderData.forEach(order => {
            order.createdAt = new Date(order.createdAt).toLocaleDateString()
        })
        res.render('orders', { orderData, isUserLoggedin: req.session.user?.loggedin, })
    },
    getSingleOrderdetails: async (req, res) => {
        const { orderId } = req.body
        const orderDetails = await orderHelper.getSingleOrderdetails(orderId)
        res.status(200).send(orderDetails)
    }
}

export default orderController