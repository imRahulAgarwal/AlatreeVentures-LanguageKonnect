import express from "express";
import paymentRouter from "./payment.js";
import userRouter from "./userRoutes.js";
import contestRouter from "./contest.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const allRouter = express.Router();

allRouter.use("/payments", paymentRouter);
allRouter.use("/users", userRouter);
allRouter.use("/contest", authMiddleware, contestRouter);

export default allRouter;
