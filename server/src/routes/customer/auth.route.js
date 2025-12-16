import express from "express";
const router = express.Router();
import { loginCtrl, logoutCtrl, registerCustomerCtrl } from "../../controllers/customer/auth.controller.js";


router.post("/register", registerCustomerCtrl);
router.post("/login", loginCtrl);
router.post("/logout", logoutCtrl);

export default router;
