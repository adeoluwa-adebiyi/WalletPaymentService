import { Schema, SchemaTypes } from "mongoose";

const walletCreditRequestSchema = new Schema({
    requestId: {
        type: String,
        unique:true,
        required: [true, "requestId required"]
    },
    status: {
        type: String,
        enum: ["pending", "success", "failure"],
        default: "pending"
    },
    amount:{
        type: Number
    },
    currency:{
        type: String,
        enum: ["NGN","USD"],
        required: [true, "currency is required"]
    },
    walletId:{
        type: String,
        required: true
    },
    cardData:{
        type: Object
    }
},
{
    timestamps:true   
});

export default walletCreditRequestSchema;