import { BankPayoutMessageParams } from "../processors/messages/bank-payout-msg";
import PayoutRepo from "../repo/payout-repo";


export interface PayoutService {
    processBankPayoutMessage(message: BankPayoutMessageParams): Promise<void>;
    makeBankTransfer(amount: number, description: String, bankId: String, currency: String): Promise<void>;
}

export class PayoutServiceImpl implements PayoutService{

    async makeBankTransfer(amount: number, description: String, bankId: String, currency: String): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async processBankPayoutMessage(message: BankPayoutMessageParams): Promise<void> {
        const payoutMsg = await PayoutRepo.savePayout({
            ...message
        });
        await this.makeBankTransfer(message.amount, message.description, message.bankId, message.currency);
    }

}

export default new PayoutServiceImpl();