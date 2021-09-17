import config from "../../config";
import { PaymentRecipient } from "../../db/models/paymentRecipient";
import Axios from "axios";
import { BankPayoutParams } from "../../processors/messages/bank-payout-message";

const type = "sandbox";

const WALLETS_TRANSFER_ENDPOINT = `https://${type}.wallets.africa/transfer/bank/account`;

const WALLETS_ACCOUNT_ENQUIRE = `https://${type}.wallets.africa/transfer/bank/account/enquire`;

const WALLETS_AFRICA_SECRET_KEY = config.WALLETS_AFRICA_SECRET_KEY;

const WALLETS_AFRICA_PUB_KEY = config.WALLETS_AFRICA_PUB_KEY;

const httpClient = Axios.create({
    headers: {
        Authorization: `Bearer ${WALLETS_AFRICA_PUB_KEY}`
    }
});


const pay = async(recipient: PaymentRecipient, payoutInfo: BankPayoutParams,bankCode?: string) => {

    console.log({WALLETS_AFRICA_PUB_KEY, WALLETS_AFRICA_SECRET_KEY});

    console.log(`Bank code: ${bankCode}`);

    try{
        const response = await httpClient.post(WALLETS_TRANSFER_ENDPOINT,{
            "SecretKey": WALLETS_AFRICA_SECRET_KEY,
            "BankCode": bankCode,
            "AccountNumber": recipient.account,
            "AccountName": recipient.name,
            "TransactionReference": payoutInfo.requestId,
            "Amount": payoutInfo.amount,
            "Narration": payoutInfo.description ?? "Transfer"
        });
        if(response.status >= 100 && response.status < 300){
            return true;
        }else{
            console.log(response.data);
            return false;
        }
    }catch(e){
        console.log(e.response);
        throw Error("Payment failed");
    }
}

const enquireAccount = async(account: String,bankCode: string):Promise<any> => {

    try{
        const response = await httpClient.post(WALLETS_ACCOUNT_ENQUIRE,{
            "SecretKey": WALLETS_AFRICA_SECRET_KEY,
            "BankCode": bankCode,
            "AccountNumber": account,
        });
        const {accountName, accountNumber} = response.data;
        return {
            account_name: accountName,
            account_number: accountNumber
        };
    }catch(e){
        console.log(e.response);
        throw Error("User Account enquiry failed");
    }
}

export default {
    pay,
    enquireAccount
}