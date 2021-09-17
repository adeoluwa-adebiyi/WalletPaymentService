import Bank, { BankParams } from "../db/models/bank";

export interface BankRepo{
    createBank(params: BankParams): Promise<BankParams>;
}

export class BankImpl implements BankRepo{

    async createBank(params: BankParams): Promise<BankParams> {
        return await new Bank(params).save();
    }

    async find(params: Partial<BankParams>): Promise<BankParams>{
        return await Bank.findOne({...params} as any);
    }

}

export default new BankImpl();