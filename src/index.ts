import { Consumer as KafkaConsumer, EachBatchPayload, Kafka, KafkaConfig } from "kafkajs";
import * as topics from "./topics";
import config from "../src/config";
import { WALLET_API_SERVICE } from "./constants";
import { KafkaService } from "./kafka";
import { CreditWalletReqMessage } from "./processors/messages/credit-wallet-req-msg";

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
        eachBatch: async(payload: EachBatchPayload) => {
            for (let message of payload.batch.messages){
                console.log(message);
                
                // await payload.heartbeat()
            }
        }
    })
}

const makePaymentFromCreditWalletRequest = async (request: CreditWalletReqMessage) => {

}

processCreditFundRequest();