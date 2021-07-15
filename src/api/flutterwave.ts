import { AxiosService } from "../config/axios"
import { FLUTTERWAVE_CHARGE_CARD_ENDPOINT } from "./urls";

import * as Flutterwave from "flutterwave-node-v3";
import config from "../config";
import walletCreditRequest, { WalletCreditRequest } from "../db/models/walletCreditRequest";

const flw = new Flutterwave(config.FLUTTERWAVE_PUB_KEY, config.FLUTTERWAVE_SECRET_KEY);

export interface FlutterChargeCardPayload{
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


export const chargeCard = async (payload: FlutterChargeCardPayload, pin:String, requestId: String) => {
    try {
        const response = await flw.Charge.card(payload);
        if (response.meta.authorization.mode === 'pin') {
            let payload2 = payload
            payload2.authorization = {
                "mode": "pin",
                "fields": [
                    "pin"
                ],
                "pin": pin
            }
            const reCallCharge = await flw.Charge.card(payload2)

            // console.log("*******************************")    
            // console.log("VALID WITH PIN");        
            // console.log(reCallCharge);
            await persistValidationRef(reCallCharge.data.flw_ref, requestId);
            return reCallCharge;
        }else{
            throw Error("payment failed: authorization mode not available");
        }
    } catch (error) {
        console.log(error)
        throw error;
    }
}


export const validateTransactionWithOTP = async(flw_ref:String,otp: String): Promise<Boolean> => {
    try{
        const callValidate = await flw.Charge.validate({
            otp,
            "flw_ref":flw_ref
        })
        console.log(callValidate)
        return callValidate?.status === "success" ?? false;
    }catch(e){
        console.log(e);
        throw e;
    }
}

export const persistValidationRef= async(flutterwaveRef:String, requestId:String) => {
    try{
        const record = await walletCreditRequest.findOne({requestId});
        record.metadata = {flw_ref: flutterwaveRef};
        await record.save();
    }catch(e){
        console.log(e);
        throw e;
    }
}
