import express from "express";
import { getUserData, login, profile, saveUserData } from "../controllers/userController.js";
import { authMiddleware, guestOnlyMiddleware } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/data/:sessionId", guestOnlyMiddleware, getUserData);
userRouter.post("/data/:sessionId", guestOnlyMiddleware, saveUserData);

userRouter.post("/login", guestOnlyMiddleware, login);

userRouter.get("/profile", authMiddleware, profile);

export default userRouter;
