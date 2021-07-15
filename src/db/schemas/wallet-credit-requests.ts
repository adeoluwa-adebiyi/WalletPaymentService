import { Schema, SchemaTypes } from "mongoose";

const walletCreditRequestSchema = new Schema({
    requestId: {
        type: String,
        unique:true,
        required: [true, "requestId required"]
    },
    userId: {
        type: String,
        required: [true, "userId required"]
    },
    status: {
        type: String,
        enum: ["init","pending", "pending-failure","validation-needed","validation-attempt", "success", "failure"],
        default: "init"
    },
    amount:{
        type: Number
    },
    email: {
        type: String,
        required: [true, "email is required"]
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
    },
    paymentGateway:{
        type: String,
        enum: ["FLUTTERWAVE", "PAYSTACK"],
        default: "FLUTTERWAVE"
    },
    metadata: {
        type: Object
    }
},
{
    timestamps:true   
});

export default walletCreditRequestSchema;