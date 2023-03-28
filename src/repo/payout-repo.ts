import bankTransfer from "../db/models/bankTransfer";
import { BankPayoutParams } from "../processors/messages/bank-payout-message";
import { PayoutRepo } from "./interface/payout-repo.interface";

export class PayoutRepoImpl implements PayoutRepo{

    async savePayout(payout: BankPayoutParams): Promise<any> {
        return await new bankTransfer({...payout}).save();
    }

}

export default new PayoutRepoImpl();