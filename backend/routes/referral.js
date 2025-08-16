import express from "express";
import { getReferrals } from "../controllers/referralController.js";

const referralRouter = express.Router();

referralRouter.get("/", getReferrals);

export default referralRouter;
