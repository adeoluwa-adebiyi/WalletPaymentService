import { model, Document } from "mongoose";
import bankSchema from "../schemas/bank";

export interface BankParams extends Document<any> {
    id: String;
    name: String;
    localInterBankCode: String,
    country: String,
    swiftCode: String
}

export default model<BankParams>("bank", bankSchema);