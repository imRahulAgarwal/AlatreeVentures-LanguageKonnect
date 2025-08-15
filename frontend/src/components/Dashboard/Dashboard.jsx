import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
	Upload,
	Play,
	Trophy,
	ThumbsUp,
	Video,
	Calendar,
	Users,
	Filter,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";

const apiUrl = process.env.REACT_APP_API_URL;

const Dashboard = () => {
	const [videos, setVideos] = useState([]);
	const [filteredVideos, setFilteredVideos] = useState([]);
	const [showUploadModal, setShowUploadModal] = useState(false);
	const [showVideoModal, setShowVideoModal] = useState(false);
	const [currentVideo, setCurrentVideo] = useState(null);
	const [loading, setLoading] = useState(true);
	const [uploadData, setUploadData] = useState({
		title: "",
		description: "",
		video: null,
	});
	const [uploading, setUploading] = useState(false);

	// Filter and pagination states
	const [filters, setFilters] = useState({
		sortBy: "votes", // votes, time
		sortOrder: "desc",
	});
	const [currentPage, setCurrentPage] = useState(1);
	const [videosPerPage] = useState(10);

	useEffect(() => {
		fetchVideos();
	}, []);

	useEffect(() => {
		applyFilters();
	}, [videos, filters]);

	const fetchVideos = async () => {
		try {
			const response = await axios.get(`${apiUrl}/api/contest/leaderboard`);
			setVideos(response.data);
		} catch (error) {
			toast.error("Failed to load videos");
		} finally {
			setLoading(false);
		}
	};

	const applyFilters = () => {
		let filtered = [...videos];

		// Sort videos
		filtered.sort((a, b) => {
			if (filters.sortBy === "votes") {
				return filters.sortOrder === "desc" ? b.totalVotes - a.totalVotes : a.totalVotes - b.totalVotes;
			} else {
				const dateA = new Date(a.uploadTime);
				const dateB = new Date(b.uploadTime);
				return filters.sortOrder === "desc" ? dateB - dateA : dateA - dateB;
			}
		});

		setFilteredVideos(filtered);
		setCurrentPage(1); // Reset to first page when filters change
	};

	const handleInputChange = (e) => {
		const { name, value, files } = e.target;
		setUploadData((prev) => ({
			...prev,
			[name]: files ? files[0] : value,
		}));
	};

	const handleUpload = async (e) => {
		e.preventDefault();

		if (!uploadData.title.trim() || !uploadData.description.trim() || !uploadData.video) {
			toast.error("All fields are required");
			return;
		}

		setUploading(true);
		const formData = new FormData();
		formData.append("title", uploadData.title.trim());
		formData.append("description", uploadData.description.trim());
		formData.append("video", uploadData.video);

		try {
			await axios.post(`${apiUrl}/api/contest/entry`, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});

			toast.success("Video uploaded successfully!");
			setShowUploadModal(false);
			setUploadData({ title: "", description: "", video: null });
			fetchVideos();
		} catch (error) {
			toast.error("Failed to upload video");
		} finally {
			setUploading(false);
		}
	};

	const handleVote = async (videoId) => {
		try {
			await axios.post(`${apiUrl}/api/vote/${videoId}`);
			toast.success("Vote submitted!");
			fetchVideos();
		} catch (error) {
			toast.error("Failed to submit vote");
		}
	};

	const handleFilterChange = (filterType, value) => {
		setFilters((prev) => ({
			...prev,
			[filterType]: value,
		}));
	};

	const openVideoModal = (video) => {
		setCurrentVideo(video);
		setShowVideoModal(true);
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	// Pagination logic
	const indexOfLastVideo = currentPage * videosPerPage;
	const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
	const currentVideos = filteredVideos.slice(indexOfFirstVideo, indexOfLastVideo);
	const totalPages = Math.ceil(filteredVideos.length / videosPerPage);

	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	if (loading) {
		return (
			<div className="container-fluid vh-100 d-flex justify-content-center align-items-center">
				<div className="spinner-border text-primary" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
			</div>
		);
	}

	return (
		<div className="container-fluid py-4">
			<div className="row">
				<div className="col-12">
					<div className="d-flex justify-content-between align-items-center mb-4">
						<h1 className="h3 fw-bold">Video Dashboard</h1>
						<button className="btn btn-primary" onClick={() => setShowUploadModal(true)}>
							<Upload className="me-2" size={18} />
							Upload Video
						</button>
					</div>

					{/* Filters */}
					<div className="card mb-4">
						<div className="card-body">
							<div className="row align-items-center">
								<div className="col-md-6">
									<div className="d-flex align-items-center">
										<Filter className="me-2 text-muted" size={18} />
										<span className="fw-medium me-3">Filters:</span>
										<div className="d-flex gap-3">
											<div>
												<label className="form-label small mb-1">Sort by:</label>
												<select
													className="form-select form-select-sm"
													value={filters.sortBy}
													onChange={(e) => handleFilterChange("sortBy", e.target.value)}>
													<option value="votes">Votes</option>
													<option value="time">Upload Time</option>
												</select>
											</div>
											<div>
												<label className="form-label small mb-1">Order:</label>
												<select
													className="form-select form-select-sm"
													value={filters.sortOrder}
													onChange={(e) => handleFilterChange("sortOrder", e.target.value)}>
													<option value="desc">Highest First</option>
													<option value="asc">Lowest First</option>
												</select>
											</div>
										</div>
									</div>
								</div>
								<div className="col-md-6 text-end">
									<small className="text-muted">
										Showing {indexOfFirstVideo + 1}-
										{Math.min(indexOfLastVideo, filteredVideos.length)} of {filteredVideos.length}{" "}
										videos
									</small>
								</div>
							</div>
						</div>
					</div>

					{/* Leaderboard Table */}
					<div className="card shadow-sm">
						<div className="card-header bg-primary text-white">
							<h5 className="mb-0">
								<Trophy className="me-2" size={20} />
								Video Leaderboard
							</h5>
						</div>
						<div className="card-body p-0">
							{filteredVideos.length === 0 ? (
								<div className="text-center py-5">
									<Video className="display-1 text-muted mb-3" size={80} />
									<p className="text-muted mt-3">No videos uploaded yet</p>
								</div>
							) : (
								<div className="table-responsive">
									<table className="table table-hover mb-0">
										<thead className="table-light">
											<tr>
												<th>Rank</th>
												<th>User</th>
												<th>Video Title</th>
												<th>Play</th>
												<th>Upload Time</th>
												<th>Votes</th>
												<th>Action</th>
											</tr>
										</thead>
										<tbody>
											{currentVideos.map((video, index) => {
												const actualRank = indexOfFirstVideo + index + 1;
												return (
													<tr key={video.id}>
														<td>
															<span
																className={`badge ${
																	actualRank <= 3 ? "bg-warning" : "bg-secondary"
																}`}>
																#{actualRank}
															</span>
														</td>
														<td className="fw-medium">{video.userName}</td>
														<td>{video.title}</td>
														<td>
															<button
																className="btn btn-outline-primary btn-sm"
																onClick={() => openVideoModal(video)}>
																<Play size={16} />
															</button>
														</td>
														<td className="text-muted small">
															<Calendar className="me-1" size={14} />
															{formatDate(video.uploadTime)}
														</td>
														<td>
															<span className="badge bg-success">
																<ThumbsUp className="me-1" size={12} />
																{video.totalVotes}
															</span>
														</td>
														<td>
															{!video.isCurrentUser ? (
																<button
																	className="btn btn-sm btn-outline-success"
																	onClick={() => handleVote(video.id)}>
																	<ThumbsUp className="me-1" size={14} />
																	Vote
																</button>
															) : (
																<span className="badge bg-info">Your Video</span>
															)}
														</td>
													</tr>
												);
											})}
										</tbody>
									</table>
								</div>
							)}
						</div>
					</div>

					{/* Pagination */}
					{totalPages > 1 && (
						<div className="d-flex justify-content-center mt-4">
							<nav>
								<ul className="pagination">
									<li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
										<button
											className="page-link"
											onClick={() => paginate(currentPage - 1)}
											disabled={currentPage === 1}>
											<ChevronLeft size={16} />
										</button>
									</li>

									{Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
										<li
											key={number}
											className={`page-item ${currentPage === number ? "active" : ""}`}>
											<button className="page-link" onClick={() => paginate(number)}>
												{number}
											</button>
										</li>
									))}

									<li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
										<button
											className="page-link"
											onClick={() => paginate(currentPage + 1)}
											disabled={currentPage === totalPages}>
											<ChevronRight size={16} />
										</button>
									</li>
								</ul>
							</nav>
						</div>
					)}
				</div>
			</div>

			{/* Upload Modal */}
			{showUploadModal && (
				<div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
					<div className="modal-dialog modal-lg">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">Upload New Video</h5>
								<button
									type="button"
									className="btn-close"
									onClick={() => setShowUploadModal(false)}></button>
							</div>
							<form onSubmit={handleUpload}>
								<div className="modal-body">
									<div className="mb-3">
										<label htmlFor="title" className="form-label fw-medium">
											Video Title
										</label>
										<input
											type="text"
											className="form-control"
											id="title"
											name="title"
											value={uploadData.title}
											onChange={handleInputChange}
											placeholder="Enter video title"
											required
										/>
									</div>
									<div className="mb-3">
										<label htmlFor="description" className="form-label fw-medium">
											Description
										</label>
										<textarea
											className="form-control"
											id="description"
											name="description"
											value={uploadData.description}
											onChange={handleInputChange}
											rows="3"
											placeholder="Describe your video"
											required></textarea>
									</div>
									<div className="mb-3">
										<label htmlFor="video" className="form-label fw-medium">
											Video File
										</label>
										<input
											type="file"
											className="form-control"
											id="video"
											name="video"
											onChange={handleInputChange}
											accept="video/*"
											required
										/>
										<div className="form-text">Supported formats: MP4, MOV, AVI, WebM</div>
									</div>
								</div>
								<div className="modal-footer">
									<button
										type="button"
										className="btn btn-secondary"
										onClick={() => setShowUploadModal(false)}>
										Cancel
									</button>
									<button
										type="submit"
										className={`btn btn-primary ${uploading ? "disabled" : ""}`}
										disabled={uploading}>
										{uploading ? (
											<>
												<span
													className="spinner-border spinner-border-sm me-2"
													role="status"></span>
												Uploading...
											</>
										) : (
											<>
												<Upload className="me-2" size={16} />
												Upload Video
											</>
										)}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}

			{/* Video Player Modal */}
			{showVideoModal && currentVideo && (
				<div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.8)" }}>
					<div className="modal-dialog modal-xl">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">{currentVideo.title}</h5>
								<button
									type="button"
									className="btn-close"
									onClick={() => setShowVideoModal(false)}></button>
							</div>
							<div className="modal-body p-0">
								<video className="w-100" controls autoPlay style={{ maxHeight: "70vh" }}>
									<source src={currentVideo.videoUrl} type="video/mp4" />
									Your browser does not support the video tag.
								</video>
							</div>
							<div className="modal-footer">
								<div className="me-auto">
									<p className="mb-1 fw-medium">
										<Users className="me-1" size={16} />
										By: {currentVideo.userName}
									</p>
									<p className="mb-0 text-muted small">{currentVideo.description}</p>
								</div>
								{!currentVideo.isCurrentUser ? (
									<button className="btn btn-success" onClick={() => handleVote(currentVideo.id)}>
										<ThumbsUp className="me-1" size={16} />
										Vote ({currentVideo.totalVotes})
									</button>
								) : (
									<span className="badge bg-info fs-6 py-2 px-3">
										Your Video ({currentVideo.totalVotes} votes)
									</span>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Dashboard;
