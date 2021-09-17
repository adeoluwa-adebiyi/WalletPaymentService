import { Request, Response } from "express";
import WalletsAfricaPayoutApi from "../api/payouts";
import WalletCreditRequestService from "../services/walletCreditRequestService";


const handlePaymentStatusEvent = async(payload: any) => {
  console.log("WALLETS_AFRICA");
  console.log(payload);
}

const paystackWebhookController = async(req:Request, res: Response) => {
  const payload = req.body;
  await WalletCreditRequestService.handlePaystackWebhookEvent(payload);
  res.sendStatus(200);
}

const walletsAfricaController = async(req:Request, res: Response) => {
  const payload = req.body;
  await handlePaymentStatusEvent(payload);
  res.sendStatus(200);
}

export default {
  paystackWebhookController,
  walletsAfricaController
}
