import { Schema } from "mongoose";

const transferRequestSchema = new Schema({
    requestId: {
        type: String,
        unique:true,
        required: [true, "requestId required"]
    },
    successful: {
        type: Boolean,
        default: true
    },
    amount:{
        type: Number
    },
    currency:{
        type: String
    },
    walletId:{
        type: String,
        required: true
    }
},
{
    timestamps:true   
});

export default transferRequestSchema;