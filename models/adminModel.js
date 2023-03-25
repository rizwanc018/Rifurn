import mongoose from "mongoose"

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const adminModel = mongoose.model('Admin', adminSchema)
export default adminModel