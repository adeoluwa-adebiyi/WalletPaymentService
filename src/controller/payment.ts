import { ensurePaymentUserAuthorized } from "../helpers/auth";
import walletCreditRequestService, { VerificationType } from "../services/walletCreditRequestService";

const paymentInitController = async (req: any, res: any) => {
    try {
        const { requestId } = req.params;
        if (!requestId) {
            throw Error("requestId is required!");
        }
        await ensurePaymentUserAuthorized(requestId, req.user.id, async () => {
            try{
            const verificationType: VerificationType = await walletCreditRequestService.makePaymentPerRequest(requestId);
            switch (verificationType) {
                case "OTP":
                    res.json({
                        status: "success",
                        needsVerification: true,
                        verification: "OTP"
                    });
                    break;
                default:
                    res.json({
                        status: "success",
                        needsVerification: false,
                        verification: null
                    });
            }
        }catch(e){
            console.log(e);
            res.status(500).json({
                status:"failure",
                message: e.message
            });
        }
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({
            status:"failure",
            message: e.message
        });
    }
}

const verifyPaymentOtpController = async (req: any, res: any) => {
    try {
        const { requestId } = req.params;
        if (!requestId) {
            throw Error("requestId is required!");
        }
        const { otp } = req.body;
        if (!otp) {
            throw Error("otp is required");
        }
        await ensurePaymentUserAuthorized(requestId, req.user.id, async () => {
            const verificationStatus = await walletCreditRequestService.verifyPaymentWithOTP(requestId, otp);
            if (!verificationStatus)
                throw Error("otp verification failed.")
            else
                res.sendStatus(204);
        })
    } catch (e) {
        res.status(500).json({
            status: "failure",
            message: e.message
        })
    }
}

export default {
    paymentInitController,
    verifyPaymentOtpController
}