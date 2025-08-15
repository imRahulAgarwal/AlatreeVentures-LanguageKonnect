import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
	throw new Error("JWT_SECRET is missing in environment variables");
}

const jwtSecret = process.env.JWT_SECRET;

export const generateToken = (payload, expiresIn = 3600) => {
	const options = { expiresIn };
	return jwt.sign(payload, jwtSecret, options);
};

export const verifyToken = (token) => {
	return jwt.verify(token, jwtSecret);
};
