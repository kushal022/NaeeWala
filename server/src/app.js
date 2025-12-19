import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "./db/knex.js"; 
import customerAuthRoute from "./routes/customer/auth.route.js"
import barberAuthRoute from "./routes/barber/auth.route.js"
import otpRoute from "./routes/otp/otp.route.js"

const app = express();

app.use(cors({
  // origin: "http://localhost:5173",
  origin: "*",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth/customer", customerAuthRoute)
app.use("/api/v1/auth/barber", barberAuthRoute)
app.use("/api/v1/otp", otpRoute)

export default app;
