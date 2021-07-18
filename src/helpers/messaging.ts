import { IEventBus } from "../bus/event-bus"
import { Message } from "../processors/messages/interface/message"

export const sendMessage = async(messenger: IEventBus<Message>,topic:String, message: Message): Promise<void> =>{
    await messenger.submitRequest(message, topic.toString());
}