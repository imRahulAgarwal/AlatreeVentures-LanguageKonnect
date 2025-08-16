import { ArrowLeft } from "lucide-react";
import React from "react";
import { Link } from "react-router";

const Privacy = () => {
	return (
		<div className="container my-5">
			<Link className="text-decoration-none d-flex gap-2 align-items-center mb-5" to="/">
				<ArrowLeft />
				<strong>Back To Home</strong>
			</Link>
			<h1 className="mb-4">Privacy Policy</h1>
			<p>
				This Privacy Policy outlines how we handle your data when using our application built with{" "}
				<a href="https://github.com/facebook/create-react-app">Create React App</a>.
			</p>

			<h2>Information We Collect</h2>
			<p>We may collect basic usage data during development and testing, as described below.</p>

			<h3>Development Mode</h3>
			<p>
				When running <code>npm start</code>, your local environment will refresh on code changes. No personal
				data is sent to our servers during this process.
			</p>

			<h3>Testing</h3>
			<p>
				When using <code>npm test</code>, test results and performance data remain within your local
				environment.
			</p>

			<h2>Build & Deployment</h2>
			<p>
				When you run <code>npm run build</code>, the application is optimized for performance and ready for
				deployment. The build process does not transmit personal information.
			</p>

			<h2>Your Choices</h2>
			<p>
				You are not required to use the <code>npm run eject</code> command. If you do, the full configuration
				files will be available in your project directory, but this action is irreversible.
			</p>

			<h2>More Information</h2>
			<p>
				To learn more about Create React App and privacy-related settings, please visit the official
				<a href="https://facebook.github.io/create-react-app/docs/getting-started">documentation</a>.
			</p>
		</div>
	);
};

export default Privacy;
