import { Consumer, EachBatchPayload } from "kafkajs";
import { Processor } from "./processor";

export class TransactionRequestResponseProcessor implements Processor {
    async process(consumer: Consumer): Promise<void> {
        await consumer.subscribe({ topic: "transfer-response"});
        await consumer.run({
                eachBatch: async(payload: EachBatchPayload) =>{
                    const { batch, resolveOffset } = payload;
                    console.log(batch.messages);
                    for (let message of batch.messages){
                        resolveOffset(message.offset);
                    }
                }
            })
    }
}