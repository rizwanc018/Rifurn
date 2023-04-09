import mongoose from "mongoose"

const addressSchema = new mongoose.Schema({
    addr1: String,
    addr2: String,
    town: String,
    state: String,
    country: String,
    zip: String
})

const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
    },
    password: {
        type: String,
    },
    address: addressSchema,
    blocked: {
        type: Boolean,
        default: false
    }
})

const UserModel = mongoose.model('User', userSchema)
export default UserModel