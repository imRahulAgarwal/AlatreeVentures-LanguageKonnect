import User from "../models/user.js";
import { verifyToken } from "../utils/token.js";

export const guestOnlyMiddleware = (req, res, next) => {
	try {
		let token;

		if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
			token = req.headers.authorization.split(" ")[1];
		}

		if (token) {
			try {
				verifyToken(token);
				return res.status(403).json({ success: false, error: "Already logged in" });
			} catch (err) {
				return next();
			}
		}

		return next();
	} catch (error) {
		console.error("guestOnly middleware error:", error);
		return res.status(500).json({ success: false, error: "Internal server error" });
	}
};

export const authMiddleware = async (req, res, next) => {
	try {
		let token;

		if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
			token = req.headers.authorization.split(" ")[1];
		}

		if (!token) {
			return res.status(401).json({ success: false, error: "Not authorized, token missing" });
		}

		let decoded;
		try {
			decoded = verifyToken(token);
		} catch (err) {
			return res.status(401).json({ success: false, error: "Invalid or expired token" });
		}

		const user = await User.findById(decoded.id).select("-password");
		if (!user) {
			return res.status(401).json({ success: false, error: "User not found" });
		}

		req.user = user;

		return next();
	} catch (error) {
		console.error("Auth middleware error:", error);
		res.status(500).json({ success: false, error: "Internal server error" });
	}
};
