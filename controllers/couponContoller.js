import couponModel from "../models/couponModel.js"

const couponController = {
    showAllCoupons: async (req, res) => {
        const coupons = await couponModel.find({})
        res.render('admin/coupons', { coupons, isAdmin: req.session.isAdmin })
    },
    addCoupon: async (req, res) => {
        const { code, amount, count } = req.body
        const isExist = await couponModel.exists({ code: code })
        if (isExist) {
            res.status(400).send('Coupon exist')
            return
        }
        const status = await couponModel.create({ code, count, discount: amount })
        res.status(200).send("success")
    },
    deleteCoupon: async (req, res) => {
        const couponId = req.params.id
        const status = await couponModel.deleteOne({ _id: couponId })
        status.deletedCount === 1 ? res.status(200).send('deleted') :
            res.status(400).send("Someting wrong")
    },
    applyCoupon: async (req, res) => {
        const userId = req.session.user.id
        const { couponCode } = req.body
        // const isExist = await couponModel.exists({ users: userId })
        const isExist = false
        if (isExist) {
            res.status(200).send({ err: true, msg: 'Coupon alredy used' })
        } else {
            const response = await couponModel.findOneAndUpdate({ code: couponCode }, { $push: { users: userId } })
            req.session.user.discount = response.discount
            if (response) res.status(200).send({success: true, discount: response.discount })
            else res.status(200).send()
        }
    }
}

export default couponController