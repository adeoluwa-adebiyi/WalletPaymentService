import { Schema } from "mongoose";

// const transferSchema = require("./transfer");

export default new Schema({
    sourceWalletId: {
        type: String,
        required: [true, "sourceWalletId cannot be empty"]
    },
    destinationWalletId:{
        type:  String,
        required: [true, "destinationWalletId cannot be empty"]
    }
});