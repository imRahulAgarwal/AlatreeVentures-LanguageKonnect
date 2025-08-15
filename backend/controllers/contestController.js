import Contest from "../models/contest.js";
import uploadVideo from "../utils/multerConfig.js";

export const uploadContestEntry = (req, res) => {
	uploadVideo.single("video")(req, res, async (err) => {
		if (err) {
			console.log(err);
			return res.status(400).json({ success: false, error: err.message });
		}

		try {
			const { title, description } = req.body;
			const userId = req.user?.id || "689eed59819fadc94d3b257a";

			if (!req.file) {
				return res.status(400).json({ error: "Video file is required" });
			}

			const videoUrl = `/uploads/${req.file.filename}`;

			const entry = await Contest.create({
				userId,
				videoUrl,
				title,
				description,
			});

			return res.status(200).json({ success: false, entry: entry.toObject() });
		} catch (error) {
			console.log(error);
			res.status(500).json({ success: false, error: error.message });
		}
	});
};

export const getLeaderboard = async (req, res) => {
	try {
		const { sortBy = "votes", sortOrder = "desc" } = req.query;
		const currentUserId = req.user?.id; // Assuming user ID is available in req.user

		let sortOptions = {};

		// Handle sorting options
		if (sortBy === "votes") {
			sortOptions = { votes: sortOrder === "desc" ? -1 : 1 };
		} else if (sortBy === "time") {
			sortOptions = { uploadTimestamp: sortOrder === "desc" ? -1 : 1 };
		} else {
			// Default to votes descending
			sortOptions = { votes: -1 };
		}

		const entries = await Contest.find().sort(sortOptions).populate("userId", "name");

		// Transform the data to match frontend expectations
		const transformedEntries = entries.map((entry) => ({
			id: entry._id,
			userName: entry.userId.name,
			title: entry.title,
			description: entry.description,
			videoUrl: `http://localhost:${process.env.PORT}${entry.videoUrl}`,
			uploadTime: entry.uploadTimestamp,
			totalVotes: entry.votes,
			isCurrentUser: currentUserId ? entry.userId._id.toString() === currentUserId.toString() : false,
		}));

		res.json(transformedEntries);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const voteEntry = async (req, res) => {
	try {
		const entry = await Contest.findById(req.params.entryId);
		if (!entry) return res.status(404).json({ error: "Entry not found" });

		entry.votes += 1;
		await entry.save();

		res.json({ votes: entry.votes });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
