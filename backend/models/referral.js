import mongoose from "mongoose";

const referralSchema = new mongoose.Schema(
	{
		referrerId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
		referredUserId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
		status: { type: String, enum: ["pending", "paid"], default: "pending" },
	},
	{ timestamps: true }
);

const Referral = mongoose.model("referrals", referralSchema);

export default Referral;
