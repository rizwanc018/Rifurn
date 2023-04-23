import mongoose from "mongoose"

// const transactionSchema = new mongoose.Schema({ amount: Number }, { timestamps: true })
const transactionSchema = new mongoose.Schema({ 
    amount: Number,
    date: {
        type: Date,
        default: Date.now
    },
    mode: String
 })


const walletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    transactions: [transactionSchema],
    balance: {
        type: Number,
        default: 0
    }
})

const walletModel = mongoose.model('Wallet', walletSchema)
export default walletModel
