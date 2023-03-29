import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    productName: String,
    category: String,
    price: Number,
    stock: Number,
    images: Array,
    description: String
})

const productModel = mongoose.model('Product', productSchema)
export default productModel