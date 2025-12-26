import ApiError from "../utils/ApiError.js";

export default roleMiddlwere = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new ApiError(403, "Access denied");
        }
        next();
    };
}
