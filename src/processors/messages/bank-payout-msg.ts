import { Message } from "./interface/message";

export interface BankPayoutMessageParams {
    requestId: String;
    status: String;
    bankId: String;
    swiftCode?: String;
    amount: number;
    destinationAccount: String;
    description: String;
    currency: String;
}

export const BANK_PAYOUT_MSG = "bank-payout";

export class BankPayoutMessage implements Message, BankPayoutMessageParams {
    entityId: string;
    version: string = "1";
    name: String = BANK_PAYOUT_MSG;
    data: any;

    requestId: String;
    status: String;
    bankId: String;
    swiftCode?: String;
    amount: number;
    destinationAccount: String;
    description: String;
    currency: String;

    constructor(params?: BankPayoutMessageParams) {
        this.requestId = params?.requestId;
        this.amount = params?.amount;
        this.currency = params?.currency;
        this.status = params?.status;
        this.bankId = params?.bankId;
        this.swiftCode = params?.swiftCode;
        this.amount = params?.amount;
        this.destinationAccount = params?.destinationAccount;
        this.description = params?.description;
    }

    getVersion(): string {
        return this.version;
    }

    getKey(): string {
        throw new Error("Method not implemented.");
    }

    serialize(): string {
        return JSON.stringify({
            entityId: this.entityId,
            version: this.version,
            name: this.name,
            data: {
                requestId: this?.requestId,
                amount: this?.amount,
                currency: this?.currency,
                status: this?.status,
                bankId: this?.bankId,
                swiftCode: this?.swiftCode,
                destinationAccount: this?.destinationAccount,
                description: this?.description
            }
        })
    }

    deserialize(json: string): BankPayoutMessage {
        const obj = JSON.parse(json);
        const data = obj.data;
        this.amount = data.amount;
        this.requestId = data?.requestId;
        this.status = data?.status;
        this.bankId = data?.bankId;
        this.swiftCode = data?.swiftCode;
        this.amount = data.amount;
        this.destinationAccount = data?.destinationAccount;
        this.description = data?.description;
        this.currency = data.currency;
        return this;
    }

}