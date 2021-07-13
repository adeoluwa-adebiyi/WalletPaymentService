import { Message } from "./interface/message";

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

    constructor(walletUserId: number, amount: number, walletId: String, cardNo: String,
        cardUsername: String,
        cardCVV: String,
        cardPIN: String,
        cardExp: String) {
        this.walletUserId = walletUserId;
        this.amount = amount;
        this.walletId = walletId;
        this.cardNo = cardNo;
        this.cardUsername = cardUsername;
        this.cardCVV = cardCVV;
        this.cardPIN = cardPIN;
        this.cardExp = cardExp;
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
                cardExp: this.cardExp
            }
        })
    }

    deserialize(json: string): Message {
        const data = JSON.parse(json);
        this.amount = data.amount;
        this.walletId = data.userId;
        this.walletUserId = data.walletUserId;
        this.cardNo = data.cardNo;
        this.cardUsername = data.cardUsername;
        this.cardCVV = data.cardCVV;
        this.cardPIN = data.cardPIN;
        this.cardExp = data.cardExp;
        return this;
    }

}