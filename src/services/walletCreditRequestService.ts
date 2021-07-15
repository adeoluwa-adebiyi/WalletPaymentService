import { Document, Model } from "mongoose";
import { isPartiallyEmittedExpression } from "typescript";
import walletCreditRequest, { WalletCreditRequest, WalletCreditRequestStatus } from "../db/models/walletCreditRequest";
import { CreditWalletReqMessage } from "../processors/messages/credit-wallet-req-msg";
import { FlutterwavePaymentStrategy } from "../strategies/payment/flutterwave";

export type VerificationType = "OTP" | "GOOGLE_AUTH";

export interface WalletCreditRequestService {
    persistCreditRequestMessage(creditRequestMessage: CreditWalletReqMessage): Promise<void>;
    makePaymentPerRequest(requestId: String):Promise<VerificationType|any>;
}

export interface OTPVerificationService{
    verifyPaymentWithOTP(requestId: String, otp:String): Promise<Boolean>;
}

export const updateRequestStatus = async(request: any, status: WalletCreditRequestStatus) => {
    request.status = status;
    await request.save();
}

export class WalletCreditRequestServiceImpl implements WalletCreditRequestService, OTPVerificationService {

    async verifyPaymentWithOTP(requestId: String, otp: String): Promise<Boolean> {
        try{
            const request = await this.walletCreditRequestRepo.findOne({requestId});
            await updateRequestStatus(request, "validation-attempt");
            switch(request.paymentGateway){
                case "FLUTTERWAVE":
                    try{
                        const status = await FlutterwavePaymentStrategy.getInstance().authenticateWithOtp(otp, request.metadata.flw_ref);
                        if(status){
                            await updateRequestStatus(request, "success");
                        }else{
                            await updateRequestStatus(request, "failure");
                        }
                        return status;
                        break;
                    }catch(e){
                        throw e;
                    }

                default:
                    throw Error("paystack verification feature not implemented");
            }
        }catch(e){
            throw e;
        }
    }

    get walletCreditRequestRepo(): Model<WalletCreditRequest> {
        return walletCreditRequest;
    }

    async persistCreditRequestMessage(creditRequestMessage: CreditWalletReqMessage): Promise<any> {
        const { cardNo, cardUsername, cardCVV, cardPIN, cardExp, amount, requestId, currency, walletId, email, walletUserId } = creditRequestMessage;
        console.log("W_ID: " + walletId);
        return await this.walletCreditRequestRepo.create({
            requestId,
            userId: walletUserId,
            amount,
            currency,
            walletId,
            email,
            cardData: {
                cardNo,
                cardUsername,
                cardCVV,
                cardPIN,
                cardExp
            },
            metadata: {
                flw_ref: null
            }
        });
    }

    async makePaymentPerRequest(requestId: String): Promise<VerificationType | any> {
        let request: any;
        try {
            request = await walletCreditRequest.findOne({
                requestId
            });
            await updateRequestStatus(request, "pending");
        } catch (e) {
            throw Error("error retrieving resource with requestId");
        }
        if (request.paymentGateway == "FLUTTERWAVE") {
            try {
                const response = await FlutterwavePaymentStrategy.getInstance().pay(
                    request.amount, request.currency, request.requestId, request.cardData, request.email
                );

                if (response?.meta?.authorization?.mode) {
                    const verificationType: VerificationType
                        = response?.meta?.authorization?.mode.toUpperCase();
                        console.log(`VERIFICATION TYPE: ${verificationType}`);
                    await updateRequestStatus(request, "validation-needed");
                    return verificationType;
                }
                await updateRequestStatus(request, "pending-failure");
                throw Error("payment failed to retrive otp challenge")
            } catch (e) {
                throw Error("payment failed");
            }
        }
        throw Error("payment gateway not supported");
    }

}

export default new WalletCreditRequestServiceImpl();