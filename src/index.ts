import { Consumer as KafkaConsumer, EachBatchPayload, Kafka, KafkaConfig } from "kafkajs";
import * as topics from "./topics";
import config from "../src/config";
import { WALLET_API_SERVICE } from "./constants";
import { KafkaService } from "./kafka";
import { CreditWalletReqMessage } from "./processors/messages/credit-wallet-req-msg";
import { FlutterwavePaymentStrategy } from "./strategies/payment/flutterwave";
import  walletCreditRequestService  from "./services/walletCreditRequestService";
import { connect } from "./db/connection";
import app from "./app";

// const kafka:Kafka = new Kafka(<KafkaConfig>{
//    clientId: WALLET_API_SERVICE,
//    brokers: [
//        config.KAFKA_BOOTSTRAP_SERVER
//    ]
// });

// const consumer: KafkaConsumer = kafka.consumer({
//     groupId: WALLET_API_SERVICE,
// });

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
    })
}


connect().then(async connection => {
    processCreditFundRequest();
    app.listen(config.PORT);
});