import walletModel from "../models/walletModel.js"
import mongoose from "mongoose"

const walletHelper = {
    updateWallet: async (userId, amount) => {
        const status = await walletModel.updateOne(
            { userId: userId },
            { userId: userId, $push: { transactions: { amount: amount } }, $inc: { balance: amount } },
            { upsert: true }
        )
        return status
    },
    getWalletData: async (req, res) => {
        const userId = req.session.user.id
        console.log("🚀 ~ file: walletHelper.js:17 ~ getWalletData: ~ userId:", userId)
        const [data] = await walletModel.aggregate([
            {
                $match: { userId: new mongoose.Types.ObjectId(userId) }
            },
            // {
            //     $unwind: 
            // }
        ])
        console.log("🚀 ~ file: walletHelper.js:21 ~ getWalletData: ~ data:", data)
        res.status(200).send(data)
    }
}

export default walletHelper