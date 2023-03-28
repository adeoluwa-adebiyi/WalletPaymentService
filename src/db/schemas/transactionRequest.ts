import { Schema } from "mongoose";
import { v4 } from "uuid";

const transactionRequestSchema = new Schema({
    id: {
        type: String,
        default: ()=> v4()
    },
    amount: {
        type: Schema.Types.Number,
        required: [true, "Transaction request amount is required"]
    },
    type: {
        type: String,
        enum: [
            "inflow",
            "outflow"
        ]
    },
    destinationWallet: {
        type: String,
        required: [true, "Transaction request destinationWallet is required"]
    },
    sourceWallet: {
        type: String,
        required: [true, "Transaction request sourceWallet is required"]
    },
    requestee: {
        type: String,
        required: [true, "Transaction request requestee is required"]
    },
    status:{
        type: String,
        enum: [
            "pending",
            "completed",
            "failed",
            "rejected"
        ],
        default: "pending"
    }
},{
    timestamps: true
});

export default transactionRequestSchema;