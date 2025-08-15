import express from "express";
import { recordReferralClick, incrementTicket } from "../controllers/referralController.js";
import { authMiddleware } from "../middleware/auth.js";

const referralRouter = express.Router();

referralRouter.post("/click", recordReferralClick);
referralRouter.post("/increment/:id", incrementTicket);

export default referralRouter;
