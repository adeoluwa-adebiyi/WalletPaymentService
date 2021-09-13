import { Request, Response } from "express";
import WalletCreditRequestService from "../services/walletCreditRequestService";


const paystackWebhookController = async(req:Request, res: Response) => {
  const payload = req.body;
  await WalletCreditRequestService.handlePaystackWebhookEvent(payload);
  res.sendStatus(200);
}

export default {
  paystackWebhookController
}
