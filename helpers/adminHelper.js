import bcrypt from "bcrypt";
import adminModel from "../models/adminModel.js";
import orderModel from "../models/orderModel.js";

const adminHelper = {
    doLogin: (req, res) => {
        return new Promise(async (resolve, reject) => {
            const { username, password } = req.body
            const adminCreds = await adminModel.findOne({ username: username })
            if (adminCreds) {
                const status = await bcrypt.compare(password, adminCreds.password)
                if (status) {
                    resolve(status)
                }
                reject("Invalid credentials")
            } else {
                reject(false)
            }
        })
    },
    getAllUsers: () => {
        return new Promise(async (resolve, reject) => {
            const allUsers = await Usermodel.find({})
            allUsers ? resolve(allUsers) : reject("No Users")
        })
    },
    deleteUser: (id) => {
        return new Promise(async (resolve, reject) => {
            const data = await Usermodel.deleteOne({ _id: id })
            data ? resolve(data) : reject("Something wrong")
        })
    },
    getUser: (id) => {
        return new Promise(async (resolve, reject) => {
            const data = await Usermodel.findById(id)
            data ? resolve(data) : reject("Not found")
        })
    },
    updateUser: (id, data) => {
        const { firstname, lastname, email } = data
        try {
            return new Promise(async (resolve, reject) => {
                if (email) {
                    const user = await Usermodel.findById(id)
                    user.firstname = firstname
                    user.lastname = lastname
                    user.email = email
                    user.save()
                    resolve()
                } else {
                    reject("Must provide email")
                }
            })
        } catch (error) {
            reject(error)
        }

    },
    addUser: (req) => {
        return new Promise(async (resolve, reject) => {
            const { firstname, lastname, email, password } = req.body
            if (email && password && firstname) {
                let emailExist = await Usermodel.exists({ email: email })
                if (emailExist) { reject({ err: "Email already exist", data: req.body }); return }
                const passwordHash = await bcrypt.hash(password, 10)
                Usermodel.create({ firstname: firstname, lastname: lastname, email: email, password: passwordHash }).then(data => {
                    resolve(data)
                })
            } else {
                reject("no email/password/firstname")
            }
        })
    },
    getSalesReport: async (option = 'daily') => {
        const format = option === 'monthly' ? '%Y-%m' :
            option === 'yearly' ? '%Y' : '%Y-%m-%d'
        const salesReport = await orderModel.aggregate([
            {
                $match: { _id: { $ne: "" } },
            },
            {
                $unwind: '$items'
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.productId',
                    foreignField: '_id',
                    as: 'result'
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: format, date: "$createdAt" }
                    },
                    orderCount: { $sum: 1 },
                    productCount: { $sum: '$items.quantity' },
                    discount: { $sum: '$discount' },
                    subTotal: { $sum: { $multiply: ['$items.quantity', { $arrayElemAt: ["$result.price", 0] }] } },
                }
            },
            {
                $project: {
                    _id: 1,
                    orderCount: 1,
                    productCount: 1,
                    discount: 1,
                    subTotal: 1
                }
            },
            {
                $project: {
                    _id: 1,
                    orderCount: 1,
                    productCount: 1,
                    discount: 1,
                    subTotal: 1,
                    total: { $subtract: ['$subTotal', '$discount'] }
                }
            },
            {
                $sort: { _id: -1 }
            }
        ])
        return salesReport
    }
}

export default adminHelper