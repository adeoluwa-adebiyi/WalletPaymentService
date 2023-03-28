import { TransferVerificationMessage } from "../processors/messages/TransferVerificationMessage";
import { sendMessage } from "../helpers/messaging";
import eventBus from "../bus/event-bus";
import { WALLET_TRX_EVENTS_TOPIC } from "../topics";
import { TransferVerificationParams } from "../db/models/transferRequestVerification";
import transferRequestVerficationRepo from "../repo/transfer-request-verfication-repo";
import { TransferCompletedMessage } from "../processors/messages/TransferCompletedMessage";
import { createMessage } from "../utils";


export interface TransferService {
    processTransferVerificationRequestMessage(message: TransferVerificationMessage): Promise<void>;
    processTransfer(requestId: String): Promise<TransferVerificationParams>;
}

class TransferServiceImpl implements TransferService {

    async processTransfer(requestId: String): Promise<TransferVerificationParams> {
        const params = await transferRequestVerficationRepo.findVerification(requestId);
        if (!params.approved)
            throw Error("Illegal transaction");
        const transferCompletedMessage = createMessage<TransferCompletedMessage, String>(
            TransferCompletedMessage,
            {
            transferRequestId: params.transferRequestId
        }, params.key);
        await sendMessage(await eventBus, WALLET_TRX_EVENTS_TOPIC, transferCompletedMessage);
        return params;
    }

    async processTransferVerificationRequestMessage(message: TransferVerificationMessage): Promise<void> {
        await transferRequestVerficationRepo.createTransferRequestVerificationParams(message);
    }
}

export default new TransferServiceImpl();