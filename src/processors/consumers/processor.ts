import { Deserializer } from "../deserializers/interface/deserializer";
import { Message } from "../messages/interface/message";
import { MessageHandler } from "../messageHandlers/interfaces/messageHandler";
import { Kafka, Consumer } from "kafkajs";

export interface Processor{
    process(consumer: Consumer): Promise<void>;
}