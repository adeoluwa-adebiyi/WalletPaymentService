export interface PaymentStrategy{
    pay(amount: Number,currency: String, requestId: String, cardDetails: any, email:String): Promise<any>;
}

export interface OtpAuthStrategy{
    authenticateWithOtp(otp: String, entityId: String): Promise<any>;
}