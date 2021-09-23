import { BankPayoutMessage, BankPayoutParams } from "../../processors/messages/bank-payout-message";

export interface PayoutRepo{
    savePayout(payout: BankPayoutParams): Promise<BankPayoutParams>;
    getPayout(payout:Partial<BankPayoutParams>): Promise<BankPayoutParams>;
}