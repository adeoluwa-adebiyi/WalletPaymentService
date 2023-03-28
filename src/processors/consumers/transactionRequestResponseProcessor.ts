import { Deserializer } from "../deserializers/interface/deserializer";
import { Message } from "../messages/interface/message";
import { TransactionRequestResponseV1 } from "../messages/transactionRequestResponseV1";
import { Processor } from "./processor";
import { MessageHandler } from "../messageHandlers/interfaces/messageHandler";


export class TransactionRequestResponseProcessor implements Processor<Message>, MessageHandler<Message>{

    constructor(){

    }

    process(message: Message) {
        throw new Error("Method not implemented.");
    }

    register() {
        throw new Error("Method not implemented.");
    }

    getDeserializer(): Deserializer {
        throw new Error("Method not implemented.");
    }

    getProcessor(message: Message): MessageHandler<Message> {

        if( message instanceof TransactionRequestResponseV1){
            return this;
        }

        throw Error("No processor available for this message")
    }

    processMessage(message: Message) {
       const processor: MessageHandler<Message> = this.getProcessor(message);

       if(processor === this){
        return this.process(message);
       }
       return;
    }

}