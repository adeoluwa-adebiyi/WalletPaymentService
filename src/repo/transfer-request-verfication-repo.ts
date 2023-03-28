import TransferRequestVerification, { TransferVerificationParams } from "../db/models/transferRequestVerification";
import { TransferVerificationRepo } from "./interface/transfer-request-verification-repo";


export class TransferVerificationRepoImpl implements TransferVerificationRepo{

    async createTransferRequestVerificationParams(request: TransferVerificationParams): Promise<any> {
        return await new TransferRequestVerification({...request}).save();
    }

    async findVerification(requestId: String): Promise<TransferVerificationParams> {
        return await TransferRequestVerification.findOne({transferRequestId: requestId});
    }

}

export default new TransferVerificationRepoImpl();