import { Message } from "./interface/message";

export class CreditWalletReqMessage implements Message{
    entityId: string;
    version: string = "1";
    name: String = "credit-wallet";
    data: any;
    walletUserId: number;
    amount: number;
    walletId: any;

    constructor(walletUserId: number, amount: number, walletId: number){
        this.walletUserId = walletUserId;
        this.amount = amount;
        this.walletId = walletId;
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
                amount: this.amount
            }
        })
    }

    deserialize(json: string): Message {
        const data = JSON.parse(json);
        this.amount = data.amount;
        this.walletId = data.userId;
        this.walletUserId = data.walletUserId;
        return this;
    }

}