import mongoose from "mongoose";

const contestSchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
		videoUrl: { type: String, required: true },
		title: { type: String, required: true },
		description: { type: String },
		uploadTimestamp: { type: Date, default: Date.now },
		votes: { type: Number, default: 0 },
	},
	{ timestamps: true }
);

const Contest = mongoose.model("contests", contestSchema);

export default Contest;
