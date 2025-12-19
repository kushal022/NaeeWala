import express from "express";
const router = express.Router();
import { barberRegisterCtrl } from "../../controllers/barber/auth.controller.js";


router.post("/register", barberRegisterCtrl);
// router.post("/login", loginCtrl);
// router.post("/logout", logoutCtrl);

export default router;


