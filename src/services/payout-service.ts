import { BankPayoutMessage, BankPayoutParams } from "../processors/messages/bank-payout-message";
import PayoutRepo from "../repo/payout-repo";
import BankRepo from "../repo/bank-repo";
import PaymentReceipientRepo from "../repo/payment-receipient-repo";
import PaystackApi, { PaystackRecipientResponse } from "../api/payouts/paystack";
import { sendMessage } from "../helpers/messaging";
import eventBus from "../bus/event-bus";
import { WALLET_TRX_EVENTS_TOPIC } from "../topics";
import { TransferCompletedMessage } from "../processors/messages/TransferCompletedMessage";
import WalletsAfricaPayoutApi from "../api/payouts";
import { PaymentRecipient } from "../db/models/paymentRecipient";
import { createMessage } from "../utils";
import { Message } from "../processors/messages/interface/message";


const paystackPay = async (params: BankPayoutParams, recipient: PaymentRecipient): Promise<Boolean> => {
    const { destinationAccount, country, bankId, requestId } = params;

    const initiatedTransfer = await PaystackApi.initiateTransfer(recipient, params);

    const { transfer_code } = initiatedTransfer

    const transferResponse = await PaystackApi.finalizeTransfer(transfer_code);

    if (transferResponse.status) {
        return true;
    } else {
        throw Error("Transfer failed");
    }
}


export interface PayoutService {
    processBankPayoutMessage(message: BankPayoutParams): Promise<void>;
    makeBankTransfer(params: BankPayoutParams): Promise<boolean>;
    getRecipient(params: BankPayoutParams): Promise<PaymentRecipient>
}

export class PayoutServiceImpl implements PayoutService {
    async getRecipient(params: BankPayoutParams): Promise<PaymentRecipient> {
        try {
            const { destinationAccount, country, bankId, requestId } = params;
            let recipient = await PaymentReceipientRepo.getRecipient({ account: destinationAccount, country, bankId });
            if (!recipient) {

                console.log(`BANK_ID:` + bankId);

                const bank = await BankRepo.find({ id: bankId });

                if (!bank) {
                    throw Error("Invalid bank");
                }

                const userAccountData = await PaystackApi.resolveAccount(params.destinationAccount, bank.localInterBankCode.toString());

                console.log("USER_ACCOUNT:");
                console.log(userAccountData);

                const recipientData = await PaystackApi.createRecipient({ ...params, acctName: userAccountData?.account_name ?? "Unknown" }, bank.localInterBankCode);

                recipient = await PaymentReceipientRepo.createRecipient({
                    account: destinationAccount,
                    paymentRecipientId: recipientData.recipientId,
                    bankId: bank.id,
                    country,
                    name: userAccountData?.account_name ?? "Unknown"
                });

            }
            return recipient;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async makeBankTransfer(params: BankPayoutParams): Promise<boolean> {
        try {
            const bank = await BankRepo.find({ id: params.bankId });
            const recipient = await this.getRecipient(params);
            console.log("RECIPIENT:");
            console.log(recipient);
            return await WalletsAfricaPayoutApi.pay(recipient, params, bank.localInterBankCode.toString());
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async processBankPayoutMessage(message: BankPayoutParams): Promise<void> {
        try {
            const payoutMsg = await PayoutRepo.savePayout({
                ...message
            });
            const status = await this.makeBankTransfer(message);
            console.log("STATUS:" + status);
            if (status) {
                const transferCompletedMessage = createMessage<TransferCompletedMessage, String>(
                    TransferCompletedMessage,
                    {
                    transferRequestId: message.requestId
                }, (message as BankPayoutMessage).getKey());
                await sendMessage(await eventBus, WALLET_TRX_EVENTS_TOPIC, transferCompletedMessage);
            } else {
                throw Error("Payment failed");
            }
        } catch (e) {
            throw e;
        }
    }

}

export default new PayoutServiceImpl();