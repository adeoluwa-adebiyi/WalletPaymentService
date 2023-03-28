import * as crypto from "crypto";
import config from "../config";

export const paystackWebhookOriginValidator = (req: any, res: any, next: any) => {
    console.log(req.body);
    var hash = crypto.createHmac('sha512', config.PAYSTACK_SECRET_KEY).update(JSON.stringify(req.body)).digest('hex');
    if (hash == req.headers['x-paystack-signature']) {
        next();
    }
    return;
}