import { Schema } from "mongoose";

const bankTransferSchema = new Schema({
    sourceWalletId: {
        type: String,
        required: [true, "sourceWalletId cannot be empty"]
    },
    acctName: {
        type: String,
    },
    bankId: {
        type: String,
        required: [true, "bankId cannot be empty"]
    },

    destinationAccount:{
        type:  String,
        required: [true, "bankAccount cannot be empty"]
    },
    swiftCode: {
        type: String,
    }
});

export default bankTransferSchema;