import { model } from "mongoose";
import walletCreditRequestSchema from "../schemas/wallet-credit-requests";

export type WalletCreditRequestStatus = "init" | "pending" | "pending-failure" | "validation-needed" | "validation-attempt" | "success" | "failure";

export type WalletCurrency = "NGN" | "USD";

export type PaymentGateway = "FLUTTERWAVE" | "PAYSTACK";

export interface WalletCreditRequestMetaData{
    flw_ref: String;
}

export interface CardDetails{
    cardNo: Number;
    cardUsername: String;
    cardCVV: String;
    cardExp: String;
    cardPIN: String;
    email: String;
}

export interface WalletCreditRequest{
    requestId: String;
    userId: String;
    status: WalletCreditRequestStatus;
    amount: Number;
    email: String;
    currency:  WalletCurrency;
    walletId: String;
    cardData: CardDetails;
    paymentGateway: PaymentGateway;
    metadata: WalletCreditRequestMetaData;
};

export default model<WalletCreditRequest>("walletCreditRequest", walletCreditRequestSchema);