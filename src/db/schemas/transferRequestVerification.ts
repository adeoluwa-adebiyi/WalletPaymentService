import { Schema, SchemaTypes } from "mongoose";
import { TransferVerificationParams } from "../models/transferRequestVerification";
import key from "./key";

export const transferTypes = ["wallet-transfer", "bank-transfer", "fx-bank-transfer"];
export type TransferType = "wallet-transfer"|"bank-transfer"|"fx-transfer";

const transferVerificationSchema = new Schema({
    ...key,
    transferRequestId: {
        type: String,
        required: true
    },
    approved: {
        type: Boolean,
        required: true,
        default: false
    },
    type: {
        type: String,
        enum: transferTypes,
        required: true
    },
    transferData:{
        type: Object,
        required: true
    }
},{
    timestamps: true
});

transferVerificationSchema.post<TransferVerificationParams>(["save", "updateOne"], async(data: TransferVerificationParams, next: Function)=>{
    data && next();
});

export default transferVerificationSchema;