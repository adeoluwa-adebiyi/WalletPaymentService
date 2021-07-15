import { StringMappingType } from "typescript";
import * as flutterwaveApi from "../../api/flutterwave";
import config from "../../config";
import { DESPayloadEncryptionStrategy } from "../3des-payload-encryption";
import { PayloadEncryption } from "../payload-encryption";
import { OtpAuthStrategy, PaymentStrategy } from "./payment";

export class FlutterwavePaymentStrategy implements PaymentStrategy, OtpAuthStrategy {

    private payloadEncryption: PayloadEncryption;

    private static INSTANCE: FlutterwavePaymentStrategy = null;

    private constructor(payloadEncryption: PayloadEncryption = new DESPayloadEncryptionStrategy()) {
        this.payloadEncryption = payloadEncryption;
    }

    static getInstance(): FlutterwavePaymentStrategy {
        if (!this.INSTANCE) {
            this.INSTANCE = new FlutterwavePaymentStrategy();
        }
        return this.INSTANCE;
    }

    async authenticateWithOtp(otp: String, entityId: String): Promise<Boolean> {
        try{
            return await flutterwaveApi.validateTransactionWithOTP(entityId, otp);
        }catch(e){
            throw Error("otp validation failed");
        }
    }

    async pay(amount: Number,currency: String, requestId: String, cardDetails: any, email: String): Promise<any> {
        // const payload = this.payloadEncryption.encryptPayload(config.FLUTTERWAVE_SECRET_KEY, cardDetails);
        const splitDate = cardDetails.cardExp.split("/");
        const response = await flutterwaveApi.chargeCard(<flutterwaveApi.FlutterChargeCardPayload>{
            amount,
            card_number: cardDetails.cardNo,
            cvv: cardDetails.CVV,
            fullname: cardDetails.cardUsername,
            email,
            expiry_month:splitDate[0],
            expiry_year:splitDate[1],
            tx_ref:requestId,
            enckey: config.FL_ENCKEY,
            currency
        }, cardDetails.cardPIN, requestId);
        return response ?? null;
    }
}