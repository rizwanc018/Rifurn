import walletModel from "../models/walletModel.js"
import mongoose from "mongoose"

const walletHelper = {
    updateWallet: async (userId, amount, mode = 'refund') => {
        const status = await walletModel.updateOne(
            { userId: userId },
            { userId: userId, $push: { transactions: { amount: amount, mode: mode } }, $inc: { balance: amount } },
            { upsert: true }
        )
        return status
    },
    getWalletData: async (req, res) => {
        const userId = req.session.user.id
        const [data] = await walletModel.aggregate([
            {
                $match: { userId: new mongoose.Types.ObjectId(userId) }
            },
            // {
            //     $unwind: 
            // }
        ])
        res.status(200).send(data)
    },
    getWalletBalance: async (userId) => {
        const { balance } = await walletModel.findOne({ userId: userId }, { balance: 1 })
        return balance
    }
}

export default walletHelper