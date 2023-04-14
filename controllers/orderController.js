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
        let id = 1
        let orderDataObj = {}
        let orderDataArr = []
        orderData.forEach(order => {
            let tmp = order._id.toString()
            if (id == tmp) {
                orderDataObj.amount += order.items.quantity * order.result.price
            } else {
                id = tmp
                orderDataArr.push(orderDataObj)
                orderDataObj = {}
                orderDataObj.id = order._id,
                    orderDataObj.status = order.orderStatus,
                    orderDataObj.amount = order.items.quantity * order.result.price
                orderDataObj.date = new Date(order.createdAt).toLocaleDateString()
            }
        })
        orderDataArr.push(orderDataObj)
        console.log("🚀 ~ file: orderController.js:33 ~ getUserOrders: ~ orderDataArr:", orderDataArr)
        // orderData.forEach(order => {
        //     order.createdAt = new Date(order.createdAt).toLocaleDateString()
        // })
        res.render('orders', { orderData: orderDataArr, isUserLoggedin: req.session.user?.loggedin, })
    },
    getSingleOrderdetails: async (req, res) => {
        const { orderId } = req.body
        const orderDetails = await orderHelper.getSingleOrderdetails(orderId)
        res.status(200).send(orderDetails)
    }
}

export default orderController