import express from "express";
import { addShopCtrl, deleteShopCtrl, updateShopCtrl } from "../../controllers/barber/shop.controller";
import authMiddleware from "../../middleware/auth.middleware";
const router = express.Router();


router.post("/add", authMiddleware, addShopCtrl);
router.delete("/:shopId", authMiddleware, deleteShopCtrl);
router.put("/:shopId", authMiddleware, updateShopCtrl)

export default router;


