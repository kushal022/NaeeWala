import ApiError from "../../utils/helper/apiError.js";
import shopServices from "../../services/barber/shop.service.js"
import { deleteShopSchema } from "../../validators/customer/auth.validator.js";

export const addShopCtrl = async (req, res, next) => {
    try {
        const barberId = req.user?.barber?.id;

        if (!barberId) {
            throw new ApiError(401, "Unauthorized barber");
        }

        const shop = await shopServices.createShop(barberId, req.body);

        return res.status(201).json({
            success: true,
            message: "Shop created successfully",
            data: shop,
        });
    } catch (error) {
        next(error);
    }
}

export const deleteShopCtrl = async (req, res, next) => {
    try {
        // Validate request
        const parsed = deleteShopSchema.parse({
            params: req.params,
        });

        const result = await shopServices.deleteShop({
            shopId: parsed.params.shopId,
            user: req.user,
        });

        return res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        next(error);
    }
}

export const updateShopCtrl = async (req, res, next) => {
    try {
        // Validate request
        const parsed = deleteShopSchema.parse({
            params: req.params,
        });

        const shop = await shopServices.updateShop({
            userId: req.user.id,
            shopId: req.params.shopId,
            payload: req.body
        });

        return res.status(200).json({
            success: true,
            message: "Your shop updated successfully!",
            data: shop
        });
    } catch (error) {
        next(error);
    }
};

