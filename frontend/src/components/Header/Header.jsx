import { NavLink } from "react-router";

const Header = ({ isAuthenticated }) => {
	return (
		<nav className="navbar navbar-expand-sm navbar-light sticky-top bg-light shadow-sm">
			<div className="container">
				<a className="navbar-brand fw-bold" href="/">
					LanguageKonnect
				</a>

				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarContent"
					aria-controls="navbarContent"
					aria-expanded="false"
					aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>

				{/* Nav Links */}
				<div className="collapse navbar-collapse" id="navbarContent">
					<ul className="navbar-nav ms-auto mb-2 mb-sm-0">
						<li className="nav-item">
							<NavLink className={({ isActive }) => (isActive ? "nav-link fw-bold" : "nav-link")} to="/">
								Home
							</NavLink>
						</li>
						{isAuthenticated ? (
							<>
								<li className="nav-item">
									<NavLink
										className={({ isActive }) => (isActive ? "nav-link fw-bold" : "nav-link")}
										to="/dashboard">
										Dashboard
									</NavLink>
								</li>
								<li className="nav-item">
									<NavLink
										className={({ isActive }) => (isActive ? "nav-link fw-bold" : "nav-link")}
										to="/referrals">
										Referrals
									</NavLink>
								</li>
							</>
						) : (
							<li className="nav-item">
								<NavLink
									className={({ isActive }) => (isActive ? "nav-link fw-bold" : "nav-link")}
									to="/login">
									Login
								</NavLink>
							</li>
						)}
						<li className="nav-item">
							<NavLink
								className={({ isActive }) => (isActive ? "nav-link fw-bold" : "nav-link")}
								to="/privacy">
								Privacy Policy
							</NavLink>
						</li>
						<li className="nav-item">
							<NavLink
								className={({ isActive }) => (isActive ? "nav-link fw-bold" : "nav-link")}
								to="/terms">
								Terms & Conditions
							</NavLink>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default Header;
