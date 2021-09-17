import { Document, model } from "mongoose";
import paymentRecipientSchema from "../schemas/paymentRecipient";

export interface PaymentRecipient extends Document<any>{
    id?: String;
    paymentRecipientId: String;
    name?: String;
    bankId: String;
    account: String;
    originator?: String;
    country: String;
    issuer?: String;
}

export default model<PaymentRecipient>("paymentRecepient", paymentRecipientSchema);