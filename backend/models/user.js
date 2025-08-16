import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: String,
		email: String,
		password: String,
		isPaid: { type: Boolean, default: true },
		referralCode: { type: String, unique: true },
		credits: { type: Number, default: 0 }, // credits means tickets
		sessionId: String,
		isRegistered: { type: Boolean, default: false },
		referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" }, // Track who referred this user
	},
	{ timestamps: true }
);

// Add an index for referralCode to make lookups fast
userSchema.index({ referralCode: 1 });

const User = mongoose.model("users", userSchema);

export default User;
