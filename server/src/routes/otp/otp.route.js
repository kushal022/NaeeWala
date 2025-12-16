import express from "express";
import { sendOtpCtrl, verifyOtpCtrl } from "../../controllers/otp/otp.controller.js";
const router = express.Router();


router.post("/send", sendOtpCtrl);
router.post("/verify", verifyOtpCtrl);

export default router;
