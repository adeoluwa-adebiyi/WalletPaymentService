import { model } from "mongoose";
import walletCreditRequestSchema from "../schemas/wallet-credit-requests";

export default model("walletCreditRequest", walletCreditRequestSchema);