import config from "../../config";
import Axios from "axios";
import { BankPayoutParams } from "../../processors/messages/bank-payout-message";
import { PaymentRecipient } from "../../db/models/paymentRecipient";

const APIKEY = config.PAYSTACK_SECRET_KEY;

const CREATE_TRANFER_RECIPIENT_ENDPOINT = "https://api.paystack.co/transferrecipient";
const INITIATE_TRANFER_ENDPOINT = "https://api.paystack.co/transfer";
const FINALIZE_TRANFER_ENDPOINT = "https://api.paystack.co/transfer/finalize_transfer";
const RESOLVE_USER_ACCOUNT = (accountNum: String, bankCode: String) => `https://api.paystack.co/bank/resolve?account_number=${accountNum}&bank_code=${bankCode}`;

const httpClient = Axios.create({
    headers: {
        Authorization: `Bearer ${APIKEY}`
    }
});

export interface PaystackRecipientResponse{
    nuban?: String;
    id: number;
    active: boolean;
    recipientId: String;
    name?: String;
}

export interface PaystackInitiateTransferResponse{
    transfer_code: String;
    id: number;
}

export interface PaystackResolveAccount{
    account_number: String;
    account_name: String;
    id: Number;
}

const createRecipient = async (params: BankPayoutParams, bankCode: String): Promise<PaystackRecipientResponse> => {

    const { acctName, description, destinationAccount, currency } = params;

    console.log(`BANK_CODE: ${bankCode}`);

    try {
        const response = await httpClient.post(CREATE_TRANFER_RECIPIENT_ENDPOINT, {
            type: "nuban",
            name: acctName,
            description: acctName,
            account_number: destinationAccount,
            bank_code: bankCode,
            currency
        });
        const { recipient_code, id, active } = response.data.data;
        return <PaystackRecipientResponse>{
            id,
            recipientId: recipient_code,
            active
        }
    } catch (e) {
        console.log(e.response.data);
        throw Error("Recipient creation failed");
    }
}

const initiateTransfer = async (recipient: PaymentRecipient, payoutParams: BankPayoutParams): Promise<PaystackInitiateTransferResponse> => {

    try {
        const response = await httpClient.post(INITIATE_TRANFER_ENDPOINT,{ 
            source: "balance", 
            reason: payoutParams.description,
            amount: payoutParams.amount, 
            recipient: recipient.paymentRecipientId
      });
        const { transfer_code, id } = response.data.data;
        return <PaystackInitiateTransferResponse>{
            id,
            transfer_code
        }
    } catch (e) {
        console.log(e.response.data);
        throw Error("Transfer initiation failed");
    }
}

const finalizeTransfer = async (transferCode: String): Promise<any> => {

    try {
        const response = await httpClient.post(FINALIZE_TRANFER_ENDPOINT,{ 
            transfer_code: transferCode
      });
        const { transfer_code, id } = response.data.data;
        return response.data;
    } catch (e) {
        throw Error("Transfer finalization iled");
    }
}

const resolveAccount = async (accountNumber: String, bankCode: String): Promise<PaystackResolveAccount> => {

    try {
        const response = await httpClient.get(RESOLVE_USER_ACCOUNT(accountNumber, bankCode));
        console.log("FETCHED:");
        console.log(response.data);
        return response.data.data;
    } catch (e) {
        console.log(e.response.message);
        throw Error("Account Resolution failed");
    }
}

export default {
    createRecipient,
    initiateTransfer,
    resolveAccount,
    finalizeTransfer
}
