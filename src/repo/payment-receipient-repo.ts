import paymentRecipient, { PaymentRecipient } from "../db/models/paymentRecipient";

export interface PaymentRecipientRepo{
    createRecipient(params: PaymentRecipient): Promise<PaymentRecipient>;
    getRecipient(params: Partial<PaymentRecipient>): Promise<PaymentRecipient>;
}

export class PaymentRecipientImpl implements PaymentRecipientRepo{

    async createRecipient(params: Partial<PaymentRecipient>): Promise<PaymentRecipient> {
        return await new paymentRecipient(params).save();
    }
    
    async getRecipient(params: Partial<PaymentRecipient>): Promise<PaymentRecipient> {
        return await paymentRecipient.findOne({...params} as any);
    }
    
}

export default new PaymentRecipientImpl();