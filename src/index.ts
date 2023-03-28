import { Consumer as KafkaConsumer, EachBatchPayload } from "kafkajs";
import * as topics from "./topics";
import config from "../src/config";
import { KafkaService } from "./kafka";
import { CreditWalletReqMessage } from "./processors/messages/credit-wallet-req-msg";
import { FlutterwavePaymentStrategy } from "./strategies/payment/flutterwave";
import  walletCreditRequestService  from "./services/walletCreditRequestService";
import { connect } from "./db/connection";
import app from "./app";
import { matchMessage } from "./helpers/messages";
import { BankPayoutMessage, BANK_PAYOUT_MSG, FulfillBankPayoutMessage, FULFILL_BANK_PAYOUT_MSG } from "./processors/messages/bank-payout-message";
import PayoutService from "./services/payout-service";
import { WALLET_API_SERVICE } from "./constants";
import { TransferVerificationMessage } from "./processors/messages/TransferVerificationMessage";


const processCreditFundRequest = async ()=>{
    const kafkaService = await KafkaService.getInstance();
    await kafkaService.consumer.subscribe({ topic: topics.WALLET_CREDIT_FUNDS_REQUEST_TOPIC, });

    await kafkaService.consumer.run({
        autoCommit:true,
        eachBatch: async(payload: EachBatchPayload) => {
            for (let message of payload.batch.messages){
                console.log(message.value.toString());
                const credWalletReqMsg:CreditWalletReqMessage = new CreditWalletReqMessage().deserialize(message.value.toString());
                console.log(credWalletReqMsg.serialize());
                const strategy = FlutterwavePaymentStrategy.getInstance();
                const {cardNo, cardUsername, cardExp, cardPIN, cardCVV, email, currency } = credWalletReqMsg;
                const savedRequest = await walletCreditRequestService.persistCreditRequestMessage(credWalletReqMsg);
                console.log("SAVED_REQUEST:");
                console.log(savedRequest);
                // await walletCreditRequestService.persistCreditRequestMessage(credWalletReqMsg);
                // strategy.pay(credWalletReqMsg.amount,credWalletReqMsg.currency, credWalletReqMsg.requestId, {
                //     cardNo, cardUsername, cardExp, cardPIN, cardCVV, enckey: config.FL_ENCKEY, email, currency
                // })
            }
        }
    });
}


const TRANSFER_VERIFICATION_MESSAGE = "transfer-verification-message";
const processTrxEvents = async ()=>{
    const kafkaService = await KafkaService.getInstance(`${WALLET_API_SERVICE}-trx-events`);
    await kafkaService.consumer.subscribe({ topic: topics.WALLET_TRX_TOPIC, });

    await kafkaService.consumer.run({
        autoCommit:true,
        eachBatch: async(payload: EachBatchPayload) => {
            for (let message of payload.batch.messages){
                try{
                    matchMessage(FULFILL_BANK_PAYOUT_MSG, message.value.toString(), new FulfillBankPayoutMessage(), handleBankPayoutEvent, message.key.toString());
                }catch(e){
                    console.log(e);
                }
            }
        }
    });
}

const handleBankPayoutEvent = async(message: FulfillBankPayoutMessage) =>{
    await PayoutService.processBankPayoutMessage(new FulfillBankPayoutMessage().deserialize(message.serialize()));
}


connect().then(async connection => {
    processCreditFundRequest();
    processTrxEvents();
    app.listen(config.PORT);
});