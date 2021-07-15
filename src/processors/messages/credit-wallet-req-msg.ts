import { Message } from "./interface/message";

export interface CreditWalletReqParams {
    walletUserId?: number; 
    amount?: number; 
    walletId?: String;
    cardNo?: String;
    cardUsername?: String;
    cardCVV?: String;
    cardPIN?: String;
    cardExp?: String;
    requestId: String;
    email: String;
    currency: String;
}

export class CreditWalletReqMessage implements Message {
    entityId: string;
    version: string = "1";
    name: String = "credit-wallet-request";
    data: any;
    walletUserId: number;
    amount: number;
    cardNo: String;
    cardUsername: String;
    cardCVV: String;
    cardPIN: String;
    cardExp: String;
    walletId: any;
    requestId: String;
    email: String;
    currency: String;

    constructor(params?: CreditWalletReqParams) {
        this.walletUserId = params?.walletUserId;
        this.amount = params?.amount;
        this.walletId = params?.walletId;
        this.cardNo = params?.cardNo;
        this.cardUsername = params?.cardUsername;
        this.cardCVV = params?.cardCVV;
        this.cardPIN = params?.cardPIN;
        this.cardExp = params?.cardExp;
        this.requestId = params?.requestId;
        this.email = params?.email;
        this.currency = params?.currency;
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
                walletUserId: this.walletUserId,
                walletId: this.walletId,
                amount: this.amount,
                cardNo: this.cardNo,
                cardUsername: this.cardUsername,
                cardCVV: this.cardCVV,
                cardPIN: this.cardPIN,
                cardExp: this.cardExp,
                requestId: this.requestId,
                email: this.email,
                currency: this.currency
            }
        })
    }

    deserialize(json: string): CreditWalletReqMessage {
        const obj = JSON.parse(json);
        const data = obj.data;
        this.amount = data.amount;
        this.walletId = data.walletId;
        this.walletUserId = data.walletUserId;
        this.cardNo = data.cardNo;
        this.cardUsername = data.cardUsername;
        this.cardCVV = data.cardCVV;
        this.cardPIN = data.cardPIN;
        this.cardExp = data.cardExp;
        this.requestId = data.requestId;
        this.email = data.email;
        this.currency = data.currency;
        return this;
    }

}