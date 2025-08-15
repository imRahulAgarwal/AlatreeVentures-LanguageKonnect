import Referral from "../models/referral.js";

export const registerReferralClick = async (req, res) => {
	try {
		const { referrerId, referredUserId } = req.body;
		await Referral.create({ referrerId, referredUserId });
		res.json({ message: "Referral recorded" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getReferralStats = async (req, res) => {
	try {
		const referrals = await Referral.find({ referrerId: req.params.userId });
		res.json({ totalTickets: referrals.filter((r) => r.status === "paid").length });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
