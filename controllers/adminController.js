import adminHelper from "../helpers/adminHelper.js"
import orderHelper from "../helpers/orderHelper.js"
import orderModel from "../models/orderModel.js"
import walletHelper from "../helpers/walletHelper.js"
import userHelper from "../helpers/userHelper.js"


const adminController = {
    getLoginPage: (req, res) => {
        if (req.session.isAdmin) res.redirect('/admin/dashboard')
        else res.render('admin/login')
    },
    doLogin: (req, res) => {
        adminHelper.doLogin(req, res)
            .then(isAdmin => {
                req.session.isAdmin = isAdmin
                res.redirect('/admin/dashboard')
            }).catch(err => {
                res.redirect('/')
            })
    },
    showDashboard: async (req, res) => {
        const [monthlyReport] = await adminHelper.getSalesReport('monthly')
        const [yearlyReport] = await adminHelper.getSalesReport('yearly')
        const deliveredOrders = await adminHelper.getNoOfOrders('delivered')
        const allOrders = await adminHelper.getNoOfOrders('all')
        let deliveredPercent = ((deliveredOrders / allOrders) * 100).toFixed(1)
        const usersCount = await userHelper.getUsersCount()
        const dailySalesReport = await adminHelper.getSalesReport()
        const { label, points } = adminHelper.generateDataForGraph(dailySalesReport)
        const paymentData = await adminHelper.getPaymentStastics()
        const paymentPoints = adminHelper.generatePaymentDataForChart(paymentData)

        res.render('admin/dashboard', { label, points,  paymentPoints, monthlyReport, yearlyReport, deliveredPercent, usersCount, isAdmin: req.session.isAdmin })
    },
    doLogOut: (req, res) => {
        req.session.isAdmin = null
        res.redirect('/')
    },
    changeOrderStatus: async (req, res) => {
        const { orderId, orderNewStatus } = req.body
        if (orderNewStatus === 'refunded') {
            const { userId, discount } = await orderModel.findOne({ _id: orderId }, { userId: 1, _id: 0, discount: 1 })
            let amount = await orderHelper.getTotal(orderId) // total: [ { total: 2000 } ]
            amount = amount[0].total - discount
            const response = await walletHelper.updateWallet(userId, amount)
        }
        const status = await orderHelper.updateStatus(orderId, orderNewStatus)
        res.status(200).send("Status changed")
    },
    showSalesReport: async (req, res) => {
        const option = req.query.q
        const salesReport = await adminHelper.getSalesReport(option)
        let grandTotal = salesReport.reduce((grand, i) => {
            return grand + i.total
        }, 0)
        res.render('admin/salesReport', { salesReport, grandTotal, isAdmin: req.session.isAdmin })
    }
}

export default adminController