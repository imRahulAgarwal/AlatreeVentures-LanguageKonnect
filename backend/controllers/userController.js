import User from "../models/user.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { generateToken } from "../utils/token.js";

export async function login(req, res) {
	try {
		const { email, password } = req.body;

		// Validate input
		if (!email || !password) {
			return res.status(400).json({ success: false, error: "Email and password are required" });
		}

		// Check if user exists
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({ success: false, error: "Invalid email or password" });
		}

		// Compare password
		const isMatch = await comparePassword(password, user.password);
		if (!isMatch) {
			return res.status(401).json({ success: false, error: "Invalid email or password" });
		}

		const token = generateToken({ id: user._id, email: user.email });

		return res.status(200).json({
			success: true,
			message: "Login successful",
			token,
			user: { id: user._id, name: user.name, email: user.email, referralCode: user.referralCode },
		});
	} catch (error) {
		console.error("Login error:", error);
		return res.status(500).json({ success: false, error: "Internal server error" });
	}
}

export async function getUserData(req, res) {
	try {
		const { sessionId } = req.params;
		if (!sessionId) {
			return res.status(400).json({ success: false, error: "Provide a valid Session ID!" });
		}

		const user = await User.findOne({ sessionId, isPaid: true });
		if (!user) {
			return res.status(404).json({ success: false, error: "User details not found" });
		}

		return res.status(200).json({ success: true, data: { name: user.name, email: user.email } });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
}

export async function saveUserData(req, res) {
	const { sessionId } = req.params;
	if (!sessionId) {
		return res.status(400).json({ success: false, error: "Provide a valid Session ID!" });
	}
	const { name, email, password, confirmPassword } = req.body;
	try {
		if (password !== confirmPassword) {
			return res.status(400).json({ success: false, error: "Passwords are not same" });
		}

		const user = await User.findOne({ sessionId, email, isPaid: true });
		if (!user) {
			return res.status(404).json({ success: false, error: "User details not found" });
		}

		const hashedPassword = await hashPassword(password);
		user.name = name;
		user.password = hashedPassword;
		user.isRegistered = true;
		await user.save();

		return res.status(200).json({ success: true, message: "User registered successfully!" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
}

export async function profile(req, res) {
	return res.status(200).json({
		success: true,
		user: {
			id: req.user._id,
			name: req.user.name,
			email: req.user.email,
			referralCode: req.user.referralCode,
			totalReferred: req.user.credits,
		},
	});
}
