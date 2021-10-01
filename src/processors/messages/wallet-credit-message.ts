import { Message } from "./interface/message";

export interface WalletCreditMessageParams{
    amount: Number;
    currency: String;
    walletId: String;
    userId: String;
}

export class WalletCreditMessage implements Message{
    entityId: String;
    version: String = "1";
    name: String = "credit";
    data: any;

    amount: Number;
    currency: String;
    walletId: String;
    userId: String;
    key?: String;

    constructor(params?: WalletCreditMessageParams){
        this.amount = params?.amount;
        this.currency = params?.currency;
        this.walletId = params?.walletId;
        this.userId = params?.userId;
    }
    setKey(key: any): void {
        this.key = key;
    }

    getVersion(): string {
        throw new Error("Method not implemented.");
    }

    getKey(): String {
        return this.key;
    }

    serialize(): string {
        return JSON.stringify({
            entityId: this.entityId,
            version: this.version,
            name: this.name,
            data:{
                amount: this.amount,
                currency: this.currency,
                walletId: this.walletId,
                userId: this.userId
            },
            key: this.key
        })
    }

    deserialize(json: string): Message {
        const object: any = JSON.parse(json);
        const data: any = object.data;
        this.version = data.version;
        this.name = object.name;
        this.amount = data.amount;
        this.currency = data.currency;
        this.walletId = data.walletId;
        this.userId = data.userId;
        this.key = object?.key;
        return this;
    }
}