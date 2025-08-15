import axios from "axios";
import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { apiUrl } from "../../../configs/envExport";
import { Upload } from "lucide-react";

const UploadMediaModal = ({ closeUploadModal, onUploadSuccess }) => {
	const [uploadData, setUploadData] = useState({ title: "", description: "", video: null });
	const [uploading, setUploading] = useState(false);

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

		const token = localStorage.getItem("token");

		try {
			await axios.post(`${apiUrl}/api/contest/entry`, formData, {
				headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
			});

			toast.success("Video uploaded successfully!");
			setUploadData({ title: "", description: "", video: null });

			// ✅ Trigger leaderboard refresh in parent
			if (onUploadSuccess) onUploadSuccess();

			closeUploadModal();
		} catch (error) {
			console.error(error);
			toast.error("Failed to upload video");
		} finally {
			setUploading(false);
		}
	};

	return (
		<div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
			<div className="modal-dialog modal-lg">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">Upload New Video</h5>
						<button type="button" className="btn-close" onClick={closeUploadModal}></button>
					</div>
					<form onSubmit={handleUpload} aria-label="Video upload form">
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
									aria-label="Enter the title of the video"
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
									required
									aria-label="Enter a description for the video"></textarea>
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
									aria-label="Select a video file to upload"
								/>
								<div className="form-text">Supported formats: MP4, MOV, AVI, WebM</div>
							</div>
						</div>
						<div className="modal-footer">
							<button
								type="button"
								className="btn btn-secondary"
								onClick={closeUploadModal}
								aria-label="Cancel video upload">
								Cancel
							</button>
							<button
								type="submit"
								className={`btn btn-primary ${uploading ? "disabled" : ""}`}
								disabled={uploading}
								aria-label={uploading ? "Uploading video" : "Upload video"}>
								{uploading ? (
									<>
										<span
											className="spinner-border spinner-border-sm me-2"
											role="status"
											aria-hidden="true"></span>
										Uploading...
									</>
								) : (
									<>
										<Upload className="me-2" size={16} aria-hidden="true" />
										Upload Video
									</>
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default UploadMediaModal;
