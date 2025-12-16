import express from "express";
const router = express.Router();
import { loginCtrl, registerCustomerCtrl } from "../../controllers/customer/auth.controller.js";


router.post("/register", registerCustomerCtrl);
router.post("/login", loginCtrl);

export default router;
