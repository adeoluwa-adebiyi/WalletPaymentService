import { Document, Model } from "mongoose";
import eventBus, { KafkaJSEventBus } from "../bus/event-bus";
import walletCreditRequest, { WalletCreditRequest, WalletCreditRequestStatus } from "../db/models/walletCreditRequest";
import { sendMessage } from "../helpers/messaging";
import { KafkaService } from "../kafka";
import { CreditWalletReqMessage } from "../processors/messages/credit-wallet-req-msg";
import { WalletCreditMessage } from "../processors/messages/wallet-credit-message";
import { FlutterwavePaymentStrategy } from "../strategies/payment/flutterwave";

export type VerificationType = "OTP" | "GOOGLE_AUTH";

const PAYSTACK_CHARGE_SUCCESS = "charge.success";
const TRXN_SUCCESS = "success";
const TRXN_VALIDATION_ATTEMPT = "validation-attempt";
const TRXN_FAILURE = "failure";
const TRXN_PENDING = "pending";
const TRXN_VALIDATION_NEEDED = "validation-needed";
const TRXN_PENDING_FAILURE = "pending-failure";
const TRXN_TYPE_FLUTTERWAVE = "FLUTTERWAVE";

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

export interface PaystackWebhookPayload{
    event: "charge.success" | "charge.dispute.create" | "charge.dispute.resolve";
    data: any;
}

export interface PaystackWebhookHandler{
    handlePaystackWebhookEvent(payload: PaystackWebhookPayload):Promise<void>;
}

export class WalletCreditRequestServiceImpl implements WalletCreditRequestService, OTPVerificationService, PaystackWebhookHandler {
    
    async handlePaystackWebhookEvent(payload: PaystackWebhookPayload): Promise<void> {
        if(payload.event === PAYSTACK_CHARGE_SUCCESS){
            const requestId = payload.data.reference;
            const request = await walletCreditRequest.findOne({
                requestId
            });
            console.log(request);
            request.metadata = payload.data;
            await updateRequestStatus(request, TRXN_SUCCESS);
            await sendMessage(await eventBus, "public.wallet.money", new WalletCreditMessage({
                currency: request?.currency,
                walletId: request?.walletId,
                amount: request?.amount,
                userId: request?.userId
            }));
        }
    }
    
    async verifyPaymentWithOTP(requestId: String, otp: String): Promise<Boolean> {
        try{
            const request = await this.walletCreditRequestRepo.findOne({requestId});
            await updateRequestStatus(request, TRXN_VALIDATION_ATTEMPT);
            switch(request.paymentGateway){
                case TRXN_TYPE_FLUTTERWAVE:
                    try{
                        const status = await FlutterwavePaymentStrategy.getInstance().authenticateWithOtp(otp, request.metadata.flw_ref);
                        if(status){
                            await updateRequestStatus(request, TRXN_SUCCESS);
                            await sendMessage(await eventBus, "public.wallet.money", new WalletCreditMessage({
                                currency: request?.currency,
                                walletId: request?.walletId,
                                amount: request?.amount,
                                userId: request?.userId
                            }));
                        }else{
                            await updateRequestStatus(request, TRXN_FAILURE);
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
            await updateRequestStatus(request, TRXN_PENDING);
        } catch (e) {
            throw Error("error retrieving resource with requestId");
        }
        if (request.paymentGateway == TRXN_TYPE_FLUTTERWAVE) {
            try {
                const response = await FlutterwavePaymentStrategy.getInstance().pay(
                    request.amount, request.currency, request.requestId, request.cardData, request.email
                );

                if (response?.meta?.authorization?.mode) {
                    const verificationType: VerificationType
                        = response?.meta?.authorization?.mode.toUpperCase();
                        // console.log(`VERIFICATION TYPE: ${verificationType}`);
                    await updateRequestStatus(request, TRXN_VALIDATION_NEEDED);
                    return verificationType;
                }
                await updateRequestStatus(request, TRXN_PENDING_FAILURE);
                throw Error("payment failed to retrive otp challenge");
            } catch (e) {
                console.log(e);
                throw Error("payment failed");
            }
        }
        throw Error("payment gateway not supported");
    }

}

export default new WalletCreditRequestServiceImpl();