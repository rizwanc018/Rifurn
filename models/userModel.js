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
    }
})

const UserModel = mongoose.model('User', userSchema)
export default UserModel