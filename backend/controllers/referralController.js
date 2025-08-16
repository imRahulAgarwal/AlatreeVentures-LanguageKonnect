import Referral from "../models/referral.js";

export const getReferrals = async (req, res) => {
	try {
		let { page = 1, limit = 10, sortOrder = "asc" } = req.query;
		const userId = req.user._id;

		page = parseInt(page, 10) || 1;
		limit = parseInt(limit, 10) || 10;
		sortOrder = sortOrder === "asc" ? 1 : -1;

		const skip = (page - 1) * limit;

		// Fetch referrals
		const referrals = await Referral.find({
			referrerId: userId,
			status: "paid",
		})
			.populate("referredUserId", "name email")
			.sort({ createdAt: sortOrder })
			.skip(skip)
			.limit(limit);

		const totalDocuments = await Referral.countDocuments({
			referrerId: userId,
			status: "paid",
		});

		const formattedReferrals = referrals.map((ref) => ({
			id: ref._id,
			name: ref.referredUserId?.name || "Unknown",
			email: ref.referredUserId?.email || "Unknown",
			referredAt: ref.createdAt,
		}));

		res.status(200).json({
			success: true,
			pagination: {
				page,
				limit,
				totalDocuments,
				totalPages: Math.ceil(totalDocuments / limit),
			},
			data: formattedReferrals,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to fetch referral data" });
	}
};
