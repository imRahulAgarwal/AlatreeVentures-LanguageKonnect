import Contest from "../models/contest.js";
import { io } from "../server.js";
import uploadVideo from "../utils/multerConfig.js";

export const uploadContestEntry = (req, res) => {
	uploadVideo.single("video")(req, res, async (err) => {
		if (err) {
			console.error(err);
			return res.status(400).json({ success: false, error: err.message });
		}

		try {
			const { title, description } = req.body;
			const userId = req.user._id;

			if (!req.file) {
				return res.status(400).json({ error: "Video file is required" });
			}

			const videoUrl = `uploads/${req.file.filename}`;

			const entry = await Contest.create({
				userId,
				videoUrl,
				title,
				description,
			});

			const formattedEntry = {
				id: entry._id,
				userId: req.user._id,
				userName: req.user.name,
				title: entry.title,
				description: entry.description,
				videoUrl: `${process.env.BACKEND_URL}/${entry.videoUrl}`,
				uploadTime: entry.uploadTimestamp,
				totalVotes: entry.votes || 0,
			};

			io.emit("new_entry", formattedEntry);

			return res.status(200).json({ success: false, entry: entry.toObject() });
		} catch (error) {
			console.error(error);
			res.status(500).json({ success: false, error: error.message });
		}
	});
};

export const getLeaderboard = async (req, res) => {
	try {
		let { page = 1, limit = 10, sortBy = "votes", sortOrder = "desc" } = req.query;

		page = parseInt(page, 10);
		limit = parseInt(limit, 10);

		let sortOptions = {};
		if (sortBy === "votes") {
			sortOptions = { votes: sortOrder === "desc" ? -1 : 1 };
		} else if (sortBy === "time") {
			sortOptions = { uploadTimestamp: sortOrder === "desc" ? -1 : 1 };
		} else {
			sortOptions = { votes: -1 };
		}

		const entries = await Contest.find()
			.sort(sortOptions)
			.skip((page - 1) * limit)
			.limit(limit)
			.populate("userId", "name")
			.lean();

		const formattedEntries = entries.map((entry) => ({
			id: entry._id,
			userId: entry.userId?._id,
			userName: entry.userId?.name,
			title: entry.title,
			description: entry.description,
			videoUrl: `${process.env.BACKEND_URL}/${entry.videoUrl}`,
			uploadTime: entry.uploadTimestamp,
			totalVotes: entry.votes,
		}));

		const totalDocuments = await Contest.countDocuments();
		const totalPages = Math.ceil(totalDocuments / limit);
		const hasNextPage = page < totalPages ? true : false;
		const hasPreviousPage = page > 1 ? true : false;

		const pagination = { totalDocuments, totalPages, hasNextPage, hasPreviousPage, limit };
		const filters = { sortBy, sortOrder };

		return res.status(200).json({ success: true, data: formattedEntries, pagination, filters });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success: false, error: error.message });
	}
};

export const voteEntry = async (req, res) => {
	try {
		const { entryId } = req.params;
		if (!entryId) {
			return res.status(400).json({ success: false, error: "Provide a valid Entry ID" });
		}

		const currentUserId = req.user._id;

		const entry = await Contest.findOne({ _id: entryId });
		if (!entry) {
			return res.status(404).json({ success: false, error: "Entry not found" });
		}

		if (entry.userId.equals(currentUserId)) {
			return res.status(404).json({ success: false, error: "Cannot self vote!" });
		}

		entry.votes += 1;
		await entry.save();

		const updatedEntry = await Contest.findOne({ _id: entryId }).populate("userId", "_id name");
		io.emit("new_vote_entry", {
			id: updatedEntry._id,
			userId: updatedEntry.userId?._id,
			userName: updatedEntry.userId?.name,
			title: updatedEntry.title,
			description: updatedEntry.description,
			videoUrl: `${process.env.BACKEND_URL}/${entry.videoUrl}`,
			uploadTime: updatedEntry.uploadTimestamp,
			totalVotes: updatedEntry.votes,
		});

		return res.status(200).json({ success: true, message: "Voted successfully" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
