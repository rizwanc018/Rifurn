import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    productName: String,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    price: Number,
    stock: Number,
    images: Array,
    description: String
})

const productModel = mongoose.model('Product', productSchema)
export default productModel