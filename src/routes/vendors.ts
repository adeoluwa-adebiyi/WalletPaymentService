import { Router } from "express";
import VendorController from "../controller/vendor";
import { paystackWebhookOriginValidator } from "../helpers/validators";

const router = Router();

router.post("/paystack", paystackWebhookOriginValidator, VendorController.paystackWebhookController);

export default router;
