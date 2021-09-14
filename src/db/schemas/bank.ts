import { Schema } from "mongoose";
import { v4 as uuid4 } from "uuid";

const bankSchema = new Schema({
    id: {
        type: String,
        default: () => uuid4()
    },
    name: {
        type: String,
        required: true
    },
    localInterBankCode: {
        type: String,
        required: true
    },
    swiftCode:{
        type: String,
    }
},{
    timestamps: true
});

export default bankSchema;