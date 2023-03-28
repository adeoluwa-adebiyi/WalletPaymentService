import { BankPayoutMessage, BankPayoutParams } from "../../processors/messages/bank-payout-message";

export interface PayoutRepo{
    savePayout(payout: BankPayoutParams): Promise<BankPayoutParams>;
}