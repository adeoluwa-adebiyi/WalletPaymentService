import { Schema } from "mongoose";
import { v4 } from "uuid";

const paymentRecipientSchema = new Schema({
    id: {
        type: String,
        default: () => v4()
    },
    recepientId: {
        type: String,
    },
    name:{
        type: String,
        required: true
    },
    bankId:{
        type: String,
        required: true
    },
    account: {
        type: String,
        required: true
    },
    orignator: {
        type: String,
        required: true,
        enum: ["paystack", "flutterwave"],
        default: "paystack"
    },
    country:{
        type: String,
        required: [true, "country is required"]
    },
    issuer: {
        type: String,
        enum: ["paystack", "flutterwave"],
        default: "paystack"
    }
},{
    timestamps: true
});

export default paymentRecipientSchema;