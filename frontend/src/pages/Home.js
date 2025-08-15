import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
	return (
		<div style={styles.container}>
			<h1 style={styles.heading}>Welcome to LanguageKonnect</h1>
			<p style={styles.subheading}>Choose a module to test</p>

			<div style={styles.buttons}>
				<Link to="/email" style={styles.link}>
					<button style={styles.button}>Email Automation</button>
				</Link>

				<Link to="/pods" style={styles.link}>
					<button style={styles.button}>Live Pods Booking</button>
				</Link>

				<Link to="/access" style={styles.link}>
					<button style={styles.button}>Founders Lifetime Access</button>
				</Link>
			</div>
		</div>
	);
};

const styles = {
	container: {
		textAlign: "center",
		marginTop: "100px",
	},
	heading: {
		fontSize: "2.5rem",
		marginBottom: "10px",
	},
	subheading: {
		fontSize: "1.2rem",
		marginBottom: "40px",
	},
	buttons: {
		display: "flex",
		justifyContent: "center",
		gap: "20px",
		flexWrap: "wrap",
	},
	link: {
		textDecoration: "none",
	},
	button: {
		padding: "12px 24px",
		fontSize: "16px",
		borderRadius: "8px",
		backgroundColor: "#007bff",
		color: "white",
		border: "none",
		cursor: "pointer",
	},
};

export default Home;
