import { Schema } from "mongoose";

const bankTransferSchema = new Schema({
    bankId: {
        type: String,
        required: [true, "nuban cannot be empty"]
    },

    destinationAccount:{
        type:  String,
        required: [true, "bankAccount cannot be empty"]
    },
    swiftCode: {
        type: String,
    },
    country:{
        type: String
    }
});

export default bankTransferSchema;