import React, { useState, useEffect, useCallback } from "react";
import Leaderboard from "./Leaderboard/Leaderboard";
import UploadMediaModal from "./UploadMediaModal/UploadMediaModal";
import { apiUrl } from "../../configs/envExport";
import axios from "axios";
import VideoModal from "./Leaderboard/VideoModal/VideoModal";
import { toast } from "react-toastify";
import socketService from "../../services/socket";

const Dashboard = ({ user }) => {
	const [leaderboardData, setLeaderboardData] = useState([]);
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
	const [sorting, setSorting] = useState([{ desc: true, id: "totalVotes" }]);
	const [pageCount, setPageCount] = useState(0);
	const [loading, setLoading] = useState(false);
	const [showUploadModal, setShowUploadModal] = useState(false);
	const [showVideoModal, setShowVideoModal] = useState(false);
	const [currentVideo, setCurrentVideo] = useState(null);

	const fetchLeaderboard = useCallback(async () => {
		setLoading(true);

		const sortBy = sorting[0]?.id || "votes";
		const sortOrder = sorting[0]?.desc ? "desc" : "asc";

		try {
			const token = localStorage.getItem("token");
			const result = await axios.get(`${apiUrl}/api/contest/leaderboard`, {
				params: {
					page: pagination.pageIndex + 1,
					limit: pagination.pageSize,
					sortBy,
					sortOrder,
				},
				headers: { Authorization: `Bearer ${token}` },
			});
			const json = result.data;
			setLeaderboardData(json.data || []);
			setPageCount(json.pagination.totalPages || 0);
		} catch (err) {
			console.error("Failed to fetch leaderboard", err);
		} finally {
			setLoading(false);
		}
	}, [pagination, sorting]);

	const handleViewVideoButton = useCallback((video) => {
		setShowVideoModal(true);
		setCurrentVideo(video);
	}, []);

	const closeVideoModal = useCallback(() => {
		setShowVideoModal(false);
		setCurrentVideo(null);
	}, []);

	const handleVoteButton = useCallback(
		async (videoId) => {
			try {
				const token = localStorage.getItem("token");
				const result = await axios.post(
					`${apiUrl}/api/contest/vote/${videoId}`,
					{},
					{ headers: { Authorization: `Bearer ${token}` } }
				);
				const json = result.data;
				if (json.success) {
					fetchLeaderboard();
				}
			} catch (err) {
				console.error("Failed to fetch leaderboard", err);
			} finally {
				setLoading(false);
			}
		},
		[fetchLeaderboard]
	);

	const handleReferralButtonClick = () => {
		const referralUrl = `${import.meta.env.VITE_APP_URL}/refer?referralCode=${user.referralCode}`;
		navigator.clipboard.writeText(referralUrl);
		toast.success("Referral Link copied!");
	};

	useEffect(() => {
		fetchLeaderboard();
	}, [fetchLeaderboard]);

	useEffect(() => {
		const socket = socketService.connect();
		socket.on("new_entry", (entry) => {
			setLeaderboardData((prev) => [...prev, entry]);
		});

		socket.on("new_vote_entry", (updatedEntry) => {
			setLeaderboardData((prev) => prev.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry)));
		});
	}, []);

	setInterval(() => fetchLeaderboard(), 300000);

	return (
		<div className="container shadow-none min-vh-100 py-4 d-flex flex-column">
			<div className="card shadow-lg border-0 mx-auto p-4 flex-grow-1 w-100 overflow-y-auto">
				{/* Header with upload button */}
				<div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
					<h2 className="fw-bold text-primary mb-3 mb-md-0">Leaderboard</h2>
					<div className="d-flex flex-column flex-sm-row gap-2 align-items-sm-center">
						<button className="btn btn-primary fw-bold" onClick={() => setShowUploadModal(true)}>
							<i className="bi bi-upload me-2"></i> Upload New Video
						</button>
						<button onClick={handleReferralButtonClick} className="btn btn-primary fw-bold">
							Copy Referral Link
						</button>
						<span>Total Referred: {user.totalReferred}</span>
					</div>
				</div>

				{/* Leaderboard Table */}
				<Leaderboard
					data={leaderboardData}
					onRefresh={fetchLeaderboard}
					pageCount={pageCount}
					pagination={pagination}
					setPagination={setPagination}
					sorting={sorting}
					setSorting={setSorting}
					loading={loading}
					handleViewVideoButton={handleViewVideoButton}
					handleVoteButton={handleVoteButton}
					user={user}
				/>
			</div>

			{/* Upload Modal */}
			{showUploadModal && (
				<UploadMediaModal
					closeUploadModal={() => setShowUploadModal(false)}
					onUploadSuccess={fetchLeaderboard}
				/>
			)}

			{showVideoModal && currentVideo && (
				<VideoModal closeVideoModal={closeVideoModal} currentVideo={currentVideo} />
			)}
		</div>
	);
};

export default Dashboard;
