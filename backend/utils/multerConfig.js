import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/");
	},
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname);
		cb(null, `${Date.now()}-${file.fieldname}${ext}`);
	},
});

// File filter for video only
const fileFilter = (req, file, cb) => {
	if (file.mimetype.startsWith("video/")) {
		cb(null, true);
	} else {
		cb(new Error("Only video files are allowed"), false);
	}
};

// Multer instance
const uploadVideo = multer({
	dest: "uploads/",
	storage,
	limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
	fileFilter,
});

export default uploadVideo;
