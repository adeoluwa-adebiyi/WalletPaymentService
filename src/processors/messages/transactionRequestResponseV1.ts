import Record from "dataclass";
import { Message } from "./interface/message";

export class TransactionRequestResponseV1 extends Record<TransactionRequestResponseV1> implements Message {
    data: any;
    
    serialize(): string {
        throw new Error("Method not implemented.");
    }
    deserialize(json: string): Message {
        throw new Error("Method not implemented.");
    }

    version: string = "1";

    name: string = "TransactionRequestResponse";

    entityId: string;

    amount: Number;

    type: "inflow" | "outflow" | "inflow" | "recharge";

    sourceWallet: string;

    destinationWallet: string;

    requestee: string;

    status: "pending" | "failed" | "success";

    time: Number;

    getVersion(): string {
        return this.version;
    }

    getKey(): string {
        return `${this.name}:${this.version}`;
    }
}