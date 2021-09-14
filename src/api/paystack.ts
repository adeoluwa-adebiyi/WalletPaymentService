import { AxiosService } from "../config/axios"
import { FLUTTERWAVE_CHARGE_CARD_ENDPOINT } from "./urls";

import * as Paystack from "paystack-node";
import config from "../config";
import walletCreditRequest, { WalletCreditRequest } from "../db/models/walletCreditRequest";

let APIKEY = 'sk_live_2hWyQ6HW73jS8p1IkXmSWOlE4y9Inhgyd6g5f2R7'
const environment = process.env.NODE_ENV

const paystack = new Paystack(APIKEY);

export interface FlutterChargeCardPayload {
    card_number: String;
    cvv: String;
    expiry_month: String;
    expiry_year: String;
    currency: String;
    amount: Number;
    redirect_url?: String;
    fullname: String;
    email: String;
    phone_number?: String;
    enckey?: String,
    tx_ref: String; //"MC-32444ee--4eerye4euee3rerds4423e43e" // This is a unique reference, unique to the particular transaction being carried out. It is generated when it is not provided by the merchant for every transaction.
    authorization?: any;
}


export const chargeCard = async (payload: FlutterChargeCardPayload, pin: String, requestId: String) => {
    try {

        // call the real API methods
        const { body } = paystack.chargeCard({
            card: {
                number: payload.card_number, // mastercard
                cvv: payload.cvv,
                expiry_year: payload.expiry_year,
                expiry_month: payload.expiry_month
            },
            email: payload.email,
            amount: payload.amount // 156,000 Naira in kobo
        });

        console.log(body);


        // const response = await paystack.Charge.card(payload);
        // console.log("PAYMENT_API:");
        // console.log(response);
        // if (response.meta.authorization.mode === 'pin') {
        //     let payload2 = payload
        //     payload2.authorization = {
        //         "mode": "pin",
        //         "fields": [
        //             "pin"
        //         ],
        //         "pin": pin
        //     }
        //     const reCallCharge = await paystack.Charge.card(payload2)

        //     // console.log("*******************************")    
        //     // console.log("VALID WITH PIN");        
        //     // console.log(reCallCharge);
        //     await persistValidationRef(reCallCharge.data.flw_ref, requestId);
        //     return reCallCharge;
        // }else{
        //     throw Error("payment failed: authorization mode not available");
        // }
    } catch (error) {
        console.log(error)
        throw error;
    }
}


export const validateTransactionWithOTP = async (flw_ref: String, otp: String): Promise<Boolean> => {
    try {
        const callValidate = await paystack.Charge.validate({
            otp,
            "flw_ref": flw_ref
        })
        console.log(callValidate)
        return callValidate?.status === "success" ?? false;
    } catch (e) {
        console.log(e);
        throw e;
    }
}

export const persistValidationRef = async (flutterwaveRef: String, requestId: String) => {
    try {
        const record = await walletCreditRequest.findOne({ requestId });
        record.metadata = { flw_ref: flutterwaveRef };
        await record.save();
    } catch (e) {
        console.log(e);
        throw e;
    }
}

export const createRecepient = async (name: String, acount: number, localInterBankCode: String, swiftCode?: String) => {
    try {
        const response = await Axios.post("", {
            type: "nuban",

            name: "Zombie",

            description: "Zombier",

            account_number: "01000000010",

            bank_code: "044",

            currency: "NGN"

        });
    } catch (e) {

    }
}
