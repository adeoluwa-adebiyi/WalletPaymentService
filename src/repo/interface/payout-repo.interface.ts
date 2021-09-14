import { BankPayoutMessage, BankPayoutMessageParams } from "../../processors/messages/bank-payout-msg";

export interface PayoutRepo{
    savePayout(payout: BankPayoutMessageParams): Promise<BankPayoutMessageParams>;
}