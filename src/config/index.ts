import * as dotenv from "dotenv";

dotenv.config()

export default {
    KAFKA_BROKER_URL: process.env.KAFKA_BROKER_URL,
    DB_URL: process.env.DB_URL,
    ...process.env
};