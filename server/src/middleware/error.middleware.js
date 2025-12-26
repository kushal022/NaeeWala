import ApiError from "../utils/helper/apiError";
import { ZodError } from "zod";

export default function errorHandler(err, req, res, next) {
    console.error("💥 ERROR:", err);

    // Default values
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";


    // Zod validation error
    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: err.errors,
        });
    }

    // ApiError
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
        });
    }

    // Objection / DB errors
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = err.message;
    }

    // If error is not operational → hide details
    if (!err.isOperational) {
        message = "Something went wrong!";
    }

    res.status(statusCode).json({
        success: false,
        message,
        errors: err.errors || null,
    });
}
