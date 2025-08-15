import express from "express";
import { createCheckoutSession } from "../controllers/paymentController.js";
import { guestOnlyMiddleware } from "../middleware/authMiddleware.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-checkout-session", guestOnlyMiddleware, createCheckoutSession);

export default paymentRouter;
