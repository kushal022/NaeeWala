import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { verifyAccessToken } from "../utils/helper/jwtHelper.js";

export default authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        throw new ApiError(401, "Unauthorized");
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = verifyAccessToken(token);
        req.user = decoded; // { id, role, username, email }
        next();
    } catch (err) {
        throw new ApiError(401, "Invalid or expired token");
    }
}
