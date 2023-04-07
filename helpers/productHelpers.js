import cloudinary from "../utils/cloudinary.js";
import productModel from "../models/productModel.js";
import fs from 'fs'
import mongoose from "mongoose";


const productHelper = {
    addProduct: (req, res) => {
        const imageId = []
        console.log(req.body);
        const { productName, productCategory, productPrice, stock, productDescription } = req.body
        return new Promise(async (resolve, reject) => {
            try {
                for (const file of req.files) {
                    const result = await cloudinary.uploader.upload(file.path);
                    fs.unlinkSync(file.path)
                    imageId.push(result.public_id)
                }
                productModel.create({ productName: productName, category: productCategory, price: productPrice, stock: stock, description: productDescription, images: imageId })
                    .then(() => {
                        resolve("Product added successfully")
                    }).catch(() => {
                        reject("Unable to add product")
                    })
            } catch (error) {
                reject(error)
            }
        })
    },
    editProduct: (req, res) => {
        const imageId = []
        const { productName, productCategory, productPrice, stock, productDescription } = req.body
        return new Promise(async (resolve, reject) => {
            try {
                for (const file of req.files) {
                    const result = await cloudinary.uploader.upload(file.path);
                    fs.unlinkSync(file.path)
                    imageId.push(result.public_id)
                    console.log("imageId", imageId)
                }
                productModel.updateOne({ _id: req.params.id }, { productName: productName, category: productCategory, price: productPrice, stock: stock, description: productDescription, $push: { images: { $each: imageId } } })
                    .then(() => {
                        resolve("Product added successfully")
                    }).catch(() => {
                        reject("Unable to add product")
                    })
            } catch (error) {
                reject(error)
            }
        })
    },
    deleteProduct: (req) => {
        const imageIds = req.query.img.split(",")
        return new Promise(async (resolve, reject) => {
            const result = await productModel.deleteOne({ _id: req.params.id })
            if (result.acknowledged) {
                for (const imageId of imageIds) {
                    cloudinary.uploader.destroy(imageId, (err, res) => {
                        console.log(err, res);
                    })
                        .then(resp => resolve(resp))
                        .catch(_err => reject("Something went wrong, please try again later."));
                }
            } else {
                reject("Something went wrong, please try again later.")
            }

        })
    },
    deleteImage: (req) => {
        const dbId = req.params.id
        const imageId = req.query.img
        return new Promise(async (resolve, reject) => {
            const result = await productModel.updateOne({ _id: dbId }, { $pullAll: { images: [imageId] } })
            if (result.acknowledged) {
                cloudinary.uploader.destroy(imageId, (err, res) => {
                    console.log(err, res);
                })
                    .then(resp => resolve(resp))
                    .catch(err => reject(err))
            } else {
                reject("-----Something went wrong, please try again later.")
            }
        })
    },
    getAllProducts: () => {
        return new Promise((resolve, reject) => {
            productModel.find({})
                .populate('category')
                .then(products => {
                    resolve(products)
                })
        })
    },
    getAllProductsByCategory: async (req) => {
        const id = new mongoose.Types.ObjectId(req.params.id)
        try {
            const products =  await productModel.find({category: id})
            return products
        } catch (err) {
            
        }
    },
    getSingleProduct: (req) => {
        const id = req.params.id
        return new Promise((resolve, reject) => {
            productModel.findById(id)
                .populate("category")
                .then(data => {
                    resolve(data)
                }).catch(err => reject(err))
        })
    }
}

export default productHelper