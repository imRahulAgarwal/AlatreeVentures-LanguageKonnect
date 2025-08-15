import "dotenv/config";
import express from "express";
import cors from "cors";
import allRouter from "./routes/all.js";
import { handleStripeWebhook } from "./controllers/paymentController.js";
import connectDatabase from "./configs/database.js";

const PORT = process.env.PORT || 5000;
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",").filter(String);

const app = express();
app.use(
	cors({
		origin: allowedOrigins,
		methods: ["GET", "POST"],
	})
);

await connectDatabase();

app.post("/api/payments/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use("/api", allRouter);

app.listen(PORT, () => console.log(`Server running at port http://localhost:${PORT}`));
