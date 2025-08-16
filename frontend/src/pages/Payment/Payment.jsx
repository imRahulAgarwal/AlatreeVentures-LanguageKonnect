import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { apiUrl } from "../../configs/envExport";

const Payment = () => {
	const [loading, setLoading] = useState(false);

	const handlePurchase = async () => {
		setLoading(true);

		const urlParams = new URLSearchParams(window.location.search);
		const referralCode = urlParams.get("referralCode");

		try {
			const finalUrl = `${apiUrl}/api/payments/create-checkout-session?referralCode=${referralCode}`;
			const response = await axios.post(finalUrl, {});

			const responseData = response.data;

			if (responseData && responseData.url) {
				window.location.href = responseData.url;
			} else {
				throw new Error("No checkout URL received");
			}
		} catch (error) {
			console.error("Checkout error:", error);
			toast.error("Payment initialization failed. Please try again.");
			setLoading(false);
		}
	};

	// Listen for successful payment (when returning from Stripe)
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const success = urlParams.get("success");
		const sessionId = urlParams.get("session_id");

		if (success === "true" && sessionId) {
			// Show success toast
			toast.success("Payment successful! Welcome to Founders' Lifetime Access!");

			// Redirect to sign up page after showing toast
			setTimeout(() => {
				window.location.href = "/signup";
			}, 2000);

			// Clean URL
			window.history.replaceState({}, document.title, window.location.pathname);
		}
	}, []);

	return (
		<div className="container-fluid vh-100 bg-light">
			<div className="row h-100">
				{/* Left Section - Purchase Card */}
				<div className="col-md-6 d-flex align-items-center justify-content-center">
					<div className="card shadow-lg border-0" style={{ maxWidth: "400px", width: "100%" }}>
						<div className="card-body text-center p-4">
							<div className="mb-3">
								<span className="badge bg-warning text-dark fs-6 mb-2">LIMITED TIME</span>
								<h4 className="card-title fw-bold text-primary">Founders' Lifetime Access</h4>
							</div>

							<div className="mb-3">
								<span className="display-4 fw-bold text-success">$19</span>
								<small className="text-muted d-block">One-time payment</small>
							</div>

							<ul className="list-unstyled text-start mb-4">
								<li className="mb-2">
									<i className="bi bi-check-circle-fill text-success me-2"></i>
									Lifetime access to all features
								</li>
								<li className="mb-2">
									<i className="bi bi-check-circle-fill text-success me-2"></i>
									No monthly subscriptions
								</li>
								<li className="mb-2">
									<i className="bi bi-check-circle-fill text-success me-2"></i>
									Exclusive founder benefits
								</li>
								<li className="mb-2">
									<i className="bi bi-check-circle-fill text-success me-2"></i>
									Priority support
								</li>
							</ul>

							<button
								className={`btn btn-primary btn-lg w-100 fw-bold ${loading ? "disabled" : ""}`}
								onClick={handlePurchase}
								disabled={loading}>
								{loading ? (
									<>
										<span className="spinner-border spinner-border-sm me-2" role="status">
											<span className="visually-hidden">Loading...</span>
										</span>
										Processing...
									</>
								) : (
									"Get Lifetime Access"
								)}
							</button>

							<small className="text-muted d-block mt-2">Secure payment powered by Stripe</small>
						</div>
					</div>
				</div>

				{/* Right Section - Promo */}
				<div className="col-md-6 bg-primary d-none d-md-flex align-items-center justify-content-center">
					<div className="text-white text-center px-4">
						<h3 className="mb-3">Join the Founders' Club!</h3>
						<p className="lead">Get lifetime access and exclusive benefits today.</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Payment;
