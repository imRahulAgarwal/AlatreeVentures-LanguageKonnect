import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { apiUrl } from "../../configs/envExport";
import { useNavigate } from "react-router";

const Register = () => {
	const [formData, setFormData] = useState({
		email: "",
		name: "",
		password: "",
		confirmPassword: "",
	});
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [sessionId, setSessionId] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const currentSessionId = urlParams.get("session_id");

		if (currentSessionId) {
			setSessionId(currentSessionId);
		} else {
			setLoading(false);
			navigate("/access");
		}
	}, []);

	const fetchCustomerData = useCallback(async () => {
		try {
			const response = await axios.get(`${apiUrl}/api/users/data/${sessionId}`);
			const {
				data: { email, name },
			} = response.data;

			setFormData((prev) => ({
				...prev,
				email: email || "",
				name: name || "",
			}));
		} catch (error) {
			console.error(error);
			console.error("Error fetching customer data:", error);
		} finally {
			setLoading(false);
		}
	}, [sessionId]);

	useEffect(() => {
		if (sessionId) {
			fetchCustomerData();
		}
	}, [sessionId, fetchCustomerData]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const validateForm = () => {
		if (!formData.name.trim()) {
			toast.error("Name is required");
			return false;
		}
		if (!formData.password) {
			toast.error("Password is required");
			return false;
		}
		if (formData.password.length < 6) {
			toast.error("Password must be at least 6 characters");
			return false;
		}
		if (formData.password !== formData.confirmPassword) {
			toast.error("Passwords do not match");
			return false;
		}
		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) return;

		setSubmitting(true);

		try {
			await axios.post(`${apiUrl}/api/users/data/${sessionId}`, {
				email: formData.email,
				name: formData.name.trim(),
				password: formData.password,
				confirmPassword: formData.confirmPassword,
			});

			toast.success("Account created successfully!");
			// Redirect to dashboard or login
			setTimeout(() => {
				window.location.href = "/login";
			}, 1500);
		} catch (error) {
			toast.error("Failed to create account");
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) {
		return (
			<div className="container-fluid vh-100 d-flex justify-content-center align-items-center">
				<div className="text-center">
					<div className="spinner-border text-primary" role="status">
						<span className="visually-hidden">Loading...</span>
					</div>
					<p className="mt-2 text-muted">Loading your information...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container-fluid vh-100 bg-light">
			<div className="row h-100">
				<div className="col-md-6 d-flex align-items-center justify-content-center">
					<div className="card shadow-lg border-0" style={{ maxWidth: "400px", width: "100%" }}>
						<div className="card-body p-4">
							<div className="text-center mb-4">
								<h2 className="card-title fw-bold text-primary">Complete Your Account</h2>
								<p className="text-muted">You're almost there! Just set your password.</p>
							</div>

							<form onSubmit={handleSubmit}>
								<div className="mb-3">
									<label htmlFor="email" className="form-label fw-medium">
										Email
									</label>
									<input
										type="email"
										className="form-control bg-light"
										id="email"
										name="email"
										value={formData.email}
										readOnly
										style={{ cursor: "not-allowed" }}
										aria-label="Email address of your account"
									/>
									<small className="text-muted">Email from your payment cannot be changed</small>
								</div>

								<div className="mb-3">
									<label htmlFor="name" className="form-label fw-medium">
										Full Name
									</label>
									<input
										type="text"
										className="form-control"
										id="name"
										name="name"
										value={formData.name}
										onChange={handleInputChange}
										placeholder="Enter your full name"
										required
										aria-label="Full name"
									/>
								</div>

								<div className="mb-3">
									<label htmlFor="password" className="form-label fw-medium">
										Password
									</label>
									<input
										type="password"
										className="form-control"
										id="password"
										name="password"
										value={formData.password}
										onChange={handleInputChange}
										placeholder="Create a secure password"
										minLength="6"
										required
										aria-label="Password you would use for your account"
									/>
									<small className="text-muted">At least 6 characters</small>
								</div>

								<div className="mb-4">
									<label htmlFor="confirmPassword" className="form-label fw-medium">
										Confirm Password
									</label>
									<input
										type="password"
										className="form-control"
										id="confirmPassword"
										name="confirmPassword"
										value={formData.confirmPassword}
										onChange={handleInputChange}
										placeholder="Confirm your password"
										required
										aria-label="Confirm password you would use for your account"
									/>
								</div>

								<button
									type="submit"
									className={`btn btn-primary btn-lg w-100 fw-bold ${submitting ? "disabled" : ""}`}
									disabled={submitting}
									aria-label={submitting ? "Creating Account..." : "Complete Account Setup"}>
									{submitting ? (
										<>
											<span className="spinner-border spinner-border-sm me-2" role="status">
												<span className="visually-hidden">Loading...</span>
											</span>
											Creating Account...
										</>
									) : (
										"Complete Account Setup"
									)}
								</button>
							</form>

							<div className="text-center mt-3">
								<small className="text-muted">
									<i className="bi bi-shield-check text-success me-1"></i>
									Your payment was successful and your data is secure
								</small>
							</div>
						</div>
					</div>
				</div>

				<div className="col-md-6 bg-primary d-none d-md-flex align-items-center justify-content-center">
					<div className="text-white text-center">
						<h3 className="mb-3">Welcome to Founders' Club!</h3>
						<p className="lead">
							You've secured your lifetime access. Complete your account to get started.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Register;
