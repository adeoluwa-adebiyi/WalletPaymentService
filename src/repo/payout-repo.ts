import bankTransfer from "../db/models/bankTransfer";
import { BankPayoutMessageParams } from "../processors/messages/bank-payout-msg";
import { PayoutRepo } from "./interface/payout-repo.interface";

export class PayoutRepoImpl implements PayoutRepo{

    async savePayout(payout: BankPayoutMessageParams): Promise<any> {
        return await new bankTransfer({...payout}).save();
    }

}

export default new PayoutRepoImpl();