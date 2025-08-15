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
	},
	{ timestamps: true }
);

const User = mongoose.model("users", userSchema);

export default User;
