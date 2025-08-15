import { Users } from "lucide-react";
import React from "react";

const VideoModal = ({ currentVideo, closeVideoModal }) => {
	return (
		<div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.8)" }}>
			<div className="modal-dialog modal-xl">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">{currentVideo.title}</h5>
						<button type="button" className="btn-close" onClick={closeVideoModal}></button>
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
					</div>
				</div>
			</div>
		</div>
	);
};

export default VideoModal;
