import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: {
        type: String,
        // required: true
    },
    mobile:{
        type: Number,
        required: true
    },
    password: {
        type: String,
        // required: true
    },
    blocked: {
        type: Boolean,
        default: false
    }
})

const UserModel = mongoose.model('User', userSchema)
export default UserModel