import express from "express";
import { getUserData, saveUserData } from "../controllers/userController.js";
import { authMiddleware, guestOnlyMiddleware } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/data/:sessionId", guestOnlyMiddleware, getUserData);
userRouter.post("/data/:sessionId", guestOnlyMiddleware, saveUserData);

userRouter.post("/login", guestOnlyMiddleware, saveUserData);

userRouter.get("/profile", authMiddleware);

export default userRouter;
