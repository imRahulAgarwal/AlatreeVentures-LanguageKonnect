import express from "express";
import { uploadContestEntry, getLeaderboard, voteEntry } from "../controllers/contestController.js";

const contestRouter = express.Router();

contestRouter.post("/entry", uploadContestEntry);
contestRouter.get("/leaderboard", getLeaderboard);
// contestRouter.post("/vote/:id", authMiddleware, voteEntry);

export default contestRouter;
