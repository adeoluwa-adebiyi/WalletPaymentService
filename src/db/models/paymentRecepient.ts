import { model } from "mongoose";
import paymentRecepientSchema from "../schemas/paymentRecepient";

export interface PaymentRecepient{
    id: String;
    paymentRecepientId: String;
    name: String;
    originator: String;
    issuer: String;
}

export default model<PaymentRecepient>("paymentRecepient", paymentRecepientSchema);