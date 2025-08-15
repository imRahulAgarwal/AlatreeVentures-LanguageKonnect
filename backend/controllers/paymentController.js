import Stripe from "stripe";
import User from "../models/User.js";
import Referral from "../models/referral.js";

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

const stripe = new Stripe(STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
	try {
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
			success_url: `${process.env.FRONTEND_URL}/register?session_id={CHECKOUT_SESSION_ID}&success=true`,
			cancel_url: `${process.env.FRONTEND_URL}/cancel`,
		});

		res.json({ url: session.url });
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err.message });
	}
};

export const handleStripeWebhook = async (req, res) => {
	const sig = req.headers["stripe-signature"];
	let event;

	try {
		event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
	} catch (err) {
		console.log(err);
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
		if (!user) {
			user = await User.create({ name, email, sessionId, isPaid: true });
		} else {
			user.name = name;
			user.sessionId = sessionId;
			user.isPaid = true;
			await user.save();
		}

		// Handle referral tickets
		// const referralCode = new URL(session.success_url).searchParams.get("ref");
		// if (referralCode) {
		// 	const referrer = await User.findOne({ referralCode });
		// 	if (referrer) {
		// 		await Referral.updateMany({ referrerId: referrer._id, referredUserId: user._id }, { status: "paid" });
		// 		referrer.tickets += 1;
		// 		await referrer.save();
		// 	}
		// }
	}

	res.json({ received: true });
};
