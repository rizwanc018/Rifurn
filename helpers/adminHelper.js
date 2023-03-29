import bcrypt from "bcrypt";
import adminModel from "../models/adminModel.js";

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
            resolve(data)
        })
    },
    getUser: (id) => {
        return new Promise(async (resolve, reject) => {
            const data = await Usermodel.findById(id)
            resolve(data)
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
    // addProduct: (req, res) => {
    //     const imageId = []
    //     const { productName, productCategory, productPrice, stock, productDescription } = req.body
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             for (const file of req.files) {
    //                 const result = await cloudinary.uploader.upload(file.path);
    //                 fs.unlinkSync(file.path)
    //                 imageId.push(result.public_id)
    //             }
    //             productModel.create({ productName: productName, category: productCategory, price: productPrice, stock: stock, description: productDescription, images: imageId })
    //                 .then(() => {
    //                     resolve("Product added successfully")
    //                 }).catch(() => {
    //                     reject("Unable to add product")
    //                 })
    //         } catch (error) {
    //             reject(error)
    //         }
    //     })
    // },
    // deleteProduct: (req) => {
    //     const imageIds = req.query.img.split(",")
    //     return new Promise(async (resolve, reject) => {
    //         const result = await productModel.deleteOne({ _id: req.params.id })
    //         if (result.acknowledged) {
    //             for (const imageId of imageIds) {
    //                 cloudinary.uploader.destroy(imageId, (err, res) =>{
    //                     console.log(err, res);
    //                 })
    //                     .then(resp => resolve(resp))
    //                     .catch(_err => reject("Something went wrong, please try again later."));
    //             }
    //         } else {
    //             reject("Something went wrong, please try again later.")
    //         }

    //     })
    // },
    // getAllProducts: () => {
    //     return new Promise((resolve, reject) => {
    //         productModel.find({})
    //             .then(products => {
    //                 resolve(products)
    //             })
    //     })
    // }
}

export default adminHelper