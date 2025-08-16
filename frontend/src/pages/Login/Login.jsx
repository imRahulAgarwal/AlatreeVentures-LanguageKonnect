import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { apiUrl } from "../../configs/envExport";

const Login = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [submitting, setSubmitting] = useState(false);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const validateForm = () => {
		if (!formData.email.trim()) {
			toast.error("Email is required");
			return false;
		}
		if (!formData.password) {
			toast.error("Password is required");
			return false;
		}
		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		setSubmitting(true);

		try {
			const res = await axios.post(`${apiUrl}/api/users/login`, {
				email: formData.email.trim(),
				password: formData.password,
			});

			// Store token if returned
			if (res.data.token) {
				localStorage.setItem("token", res.data.token);
			}

			toast.success("Login successful!");
			setTimeout(() => {
				window.location.href = "/dashboard";
			}, 1500);
		} catch (err) {
			console.log(err);
			toast.error("Please try again later");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="container-fluid vh-100 bg-light">
			<div className="row h-100">
				<div className="col-md-6 d-flex align-items-center justify-content-center">
					<div className="card shadow-lg border-0" style={{ maxWidth: "400px", width: "100%" }}>
						<div className="card-body p-4">
							<div className="text-center mb-4">
								<h2 className="card-title fw-bold text-primary">Welcome Back</h2>
								<p className="text-muted">Log in to your account</p>
							</div>

							<form onSubmit={handleSubmit}>
								<div className="mb-3">
									<label htmlFor="email" className="form-label fw-medium">
										Email
									</label>
									<input
										type="email"
										className="form-control"
										id="email"
										name="email"
										value={formData.email}
										onChange={handleInputChange}
										placeholder="Enter your email"
										required
										aria-label="Email address to login"
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
										placeholder="Enter your password"
										required
										aria-label="Password of your account to login"
									/>
								</div>

								<button
									type="submit"
									className={`btn btn-primary btn-lg w-100 fw-bold ${submitting ? "disabled" : ""}`}
									disabled={submitting}>
									{submitting ? (
										<>
											<span className="spinner-border spinner-border-sm me-2" role="status">
												<span className="visually-hidden">Loading...</span>
											</span>
											Logging in...
										</>
									) : (
										"Login"
									)}
								</button>
							</form>
						</div>
					</div>
				</div>

				<div className="col-md-6 bg-primary d-none d-md-flex align-items-center justify-content-center">
					<div className="text-white text-center">
						<h3 className="mb-3">Join the Founders' Club!</h3>
						<p className="lead">Log in and continue your journey.</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
