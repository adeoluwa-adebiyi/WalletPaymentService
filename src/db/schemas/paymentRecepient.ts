import { Schema } from "mongoose";
import { v4 } from "uuid";

const paymentRecepientSchema = new Schema({
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
    orignator: {
        type: String,
        required: true
    },
    issuer: {
        type: String,
        enum: ["paystack", "flutterwave"],
        default: "paystack"
    }
},{
    timestamps: true
});

export default paymentRecepientSchema;