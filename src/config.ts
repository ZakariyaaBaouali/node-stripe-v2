import dotenv from "dotenv";
dotenv.config();

export const SERVER_PORT = process.env.PORT;
export const STRIPE_SECRET_KEY = process.env.STRIPE_KEY || "";
