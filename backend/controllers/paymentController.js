import Stripe from "stripe";
import User from "../models/user.js";
import Referral from "../models/referral.js";
import { generateReferralCode } from "../utils/generateReferralCode.js";

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

const stripe = new Stripe(STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
	try {
		const referralCode = req.query.referralCode || "";

		let referrer = null;
		if (referralCode) {
			referrer = await User.findOne({ referralCode });
		}

		const session = await stripe.checkout.sessions.create({
			mode: "payment",
			line_items: [
				{
					price_data: {
						currency: "usd",
						product_data: { name: "Founders’ Lifetime Access" },
						unit_amount: 1900,
					},
					quantity: 1,
				},
			],
			metadata: { referralCode },
			success_url: `${process.env.FRONTEND_URL}/register?session_id={CHECKOUT_SESSION_ID}&success=true`,
			cancel_url: `${process.env.FRONTEND_URL}/cancel`,
		});

		if (referrer) {
			await Referral.create({
				referrerId: referrer._id,
				stripeSessionId: session.id,
				referralCodeUsed: referralCode,
				status: "pending",
				expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
			});
		}

		res.status(200).json({ url: session.url });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: err.message });
	}
};

export const handleStripeWebhook = async (req, res) => {
	const sig = req.headers["stripe-signature"];
	let event;

	try {
		event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
	} catch (err) {
		console.error(err);
		return res.status(400).send(`Webhook Error: ${err.message}`);
	}

	if (event.type === "checkout.session.completed") {
		const session = event.data.object;

		// Mark user as paid or create new paid user
		const customerDetails = session.customer_details;
		const name = customerDetails.name;
		const email = customerDetails.email;
		const sessionId = session.id;

		let user = await User.findOne({ email });
		const wasAlreadyPaid = user?.isPaid;
		if (!user) {
			user = await User.create({ name, email, sessionId, isPaid: true, referralCode: generateReferralCode() });
		} else {
			user.name = name;
			user.sessionId = sessionId;
			user.isPaid = true;
			if (!user.referralCode) {
				user.referralCode = generateReferralCode();
			}
			await user.save();
		}

		const referralCode = session.metadata.referralCode;

		// Match referral using stripeSessionId first
		let referral = await Referral.findOne({ stripeSessionId: sessionId });

		// If not found, fallback to metadata.referralCode
		if (!referral && referralCode) {
			const referrer = await User.findOne({ referralCode });
			if (referrer) {
				referral = await Referral.create({
					referrerId: referrer._id,
					referredUserId: user._id,
					stripeSessionId: sessionId,
					referralCodeUsed: referralCode,
					status: "paid",
				});
			}
		}

		if (referral && !wasAlreadyPaid) {
			referral.referredUserId = user._id;
			referral.status = "paid";
			await referral.save();

			const referrer = await User.findById(referral.referrerId);
			if (referrer) {
				referrer.credits += 1;
				await referrer.save();

				if (!user.referredBy) {
					user.referredBy = referrer._id;
					await user.save();
				}
			}
		}
	}

	res.json({ received: true });
};
