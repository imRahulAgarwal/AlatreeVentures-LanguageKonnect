import mongoose from "mongoose";

const referralSchema = new mongoose.Schema(
	{
		// The user who generated the referral link
		referrerId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
		// The user who signed up using the referral link (linked after successful payment)
		referredUserId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
		// Track status of referral lifecycle
		// "pending" → checkout session created but not completed
		// "paid" → user completed payment successfully
		status: { type: String, enum: ["pending", "paid"], default: "pending" },
		// Store stripeSessionId to map webhook events to this referral
		stripeSessionId: { type: String, index: true },
		// Keep referralCode in case we need to backtrack from metadata if referral not found
		referralCodeUsed: { type: String },
		// Expiry option for insights (e.g., pending referrals expire after X days)
		expiresAt: { type: Date },
	},
	{ timestamps: true }
);

// Index combination to prevent duplicates: one referrer cannot refer the same user twice
referralSchema.index({ referrerId: 1, referredUserId: 1 }, { unique: true, sparse: true });

const Referral = mongoose.model("referrals", referralSchema);

export default Referral;
