import { Link } from "react-router";

const Home = ({ isLoggedIn }) => {
	return (
		<div className="container-fluid vh-100 bg-light">
			<div className="row h-100">
				<div className="col-md-6 d-flex flex-column align-items-center justify-content-center position-relative">
					<div className="card shadow-lg border-0" style={{ maxWidth: "400px", width: "100%" }}>
						<div className="card-body p-4">
							<div className="text-center mb-4">
								<h2 className="card-title fw-bold text-primary">Welcome to LanguageKonnect</h2>
								<p className="text-muted">Choose a module</p>
							</div>

							<div className="d-grid gap-2">
								{isLoggedIn ? (
									<div className="d-flex justify-content-center align-items-center gap-2">
										<Link to="/dashboard">
											<button className="btn btn-primary btn-lg fw-bold">Dashboard</button>
										</Link>
										<Link to="/referrals">
											<button className="btn btn-success btn-lg fw-bold">Referrals</button>
										</Link>
									</div>
								) : (
									<div className="d-flex flex-column align-items-center gap-2">
										<Link to="/access" className="w-100">
											<button className="w-100 btn btn-primary btn-lg fw-bold">
												Buy Founders Lifetime Access
											</button>
										</Link>
										<Link to="/login" className="w-100">
											<button className="w-100 btn btn-secondary btn-lg fw-bold">
												Login to Founders Lifetime Access
											</button>
										</Link>
									</div>
								)}
							</div>
						</div>
					</div>

					<div className="position-absolute bottom-0 mb-4 d-flex gap-2">
						<Link to="/terms" className="text-decoration-none">
							Terms & Conditions
						</Link>
						<Link to="/terms" className="text-decoration-none">
							Privacy Policy
						</Link>
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

export default Home;
