import { ArrowLeft } from "lucide-react";
import React from "react";
import { Link } from "react-router";

const Terms = () => {
	return (
		<div className="container my-5">
			<Link className="text-decoration-none d-flex gap-2 align-items-center mb-5" to="/">
				<ArrowLeft />
				<strong>Back To Home</strong>
			</Link>

			<h1 className="mb-4">Terms & Conditions</h1>
			<p>
				This project was bootstrapped with{" "}
				<a href="https://github.com/facebook/create-react-app">Create React App</a>.
			</p>

			<h2>Available Scripts</h2>
			<p>In the project directory, you can run:</p>

			<h3>
				<code>npm start</code>
			</h3>
			<p>
				Runs the app in the development mode.
				<br />
				Open <a href="http://localhost:3000">http://localhost:3000</a> to view it in your browser.
			</p>
			<p>
				The page will reload when you make changes.
				<br />
				You may also see any lint errors in the console.
			</p>

			<h3>
				<code>npm test</code>
			</h3>
			<p>
				Launches the test runner in the interactive watch mode.
				<br />
				See the section about{" "}
				<a href="https://facebook.github.io/create-react-app/docs/running-tests">running tests</a> for more
				information.
			</p>

			<h3>
				<code>npm run build</code>
			</h3>
			<p>
				Builds the app for production to the <code>build</code> folder.
				<br />
				It correctly bundles React in production mode and optimizes the build for the best performance.
			</p>
			<p>
				The build is minified and the filenames include the hashes.
				<br />
				Your app is ready to be deployed!
			</p>
			<p>
				See the section about{" "}
				<a href="https://facebook.github.io/create-react-app/docs/deployment">deployment</a> for more
				information.
			</p>

			<h3>
				<code>npm run eject</code>
			</h3>
			<p>
				<strong>Note: this is a one-way operation. Once you eject, you can't go back!</strong>
			</p>
			<p>
				If you aren't satisfied with the build tool and configuration choices, you can eject at any time. This
				command will remove the single build dependency from your project.
			</p>

			<h2>Learn More</h2>
			<p>
				You can learn more in the{" "}
				<a href="https://facebook.github.io/create-react-app/docs/getting-started">
					Create React App documentation
				</a>
				.
			</p>
			<p>
				To learn React, check out the <a href="https://reactjs.org/">React documentation</a>.
			</p>

			<h3>Additional Links</h3>
			<ul>
				<li>
					<a href="https://facebook.github.io/create-react-app/docs/code-splitting">Code Splitting</a>
				</li>
				<li>
					<a href="https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size">
						Analyzing the Bundle Size
					</a>
				</li>
				<li>
					<a href="https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app">
						Making a Progressive Web App
					</a>
				</li>
				<li>
					<a href="https://facebook.github.io/create-react-app/docs/advanced-configuration">
						Advanced Configuration
					</a>
				</li>
				<li>
					<a href="https://facebook.github.io/create-react-app/docs/deployment">Deployment</a>
				</li>
				<li>
					<a href="https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify">
						Build Failures
					</a>
				</li>
			</ul>
		</div>
	);
};

export default Terms;
