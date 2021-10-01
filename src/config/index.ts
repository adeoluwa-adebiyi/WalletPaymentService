import * as dotenv from "dotenv";

dotenv.config()

export default {
    KAFKA_BOOTSTRAP_SERVER: process.env.KAFKA_BOOTSTRAP_SERVER,
    FLUTTERWAVE_SECRET_KEY: process.env.FLUTTERWAVE_SECRET_KEY,
    FLUTTERWAVE_PUB_KEY: process.env.FLUTTERWAVE_PUB_KEY,
    FL_ENCKEY: process.env.FL_ENCKEY,
    DB_URL: process.env.DB_URL,
    WALLETS_API_TYPE: process.env.WALLETS_API_TYPE,
    APP_SECRET: process.env.APP_SECRET,
    PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY,
    WALLETS_AFRICA_SECRET_KEY: process.env.WALLETS_AFRICA_SECRET_KEY,
    WALLETS_AFRICA_PUB_KEY: process.env.WALLETS_AFRICA_PUB_KEY,
    PORT: process.env.POST,
    ...process.env
};