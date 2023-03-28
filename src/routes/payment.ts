import { Router } from "express";
import paymentController from "../controller/payment";
import { userAuthenticated, userSessionMiddleware } from "../midddlewares/userSession";

const router: Router = Router();

router.get("/:requestId", [userSessionMiddleware, userAuthenticated], paymentController.paymentInitController);
router.post("/verify-otp/:requestId", [userSessionMiddleware, userAuthenticated], paymentController.verifyPaymentOtpController);


export default router;