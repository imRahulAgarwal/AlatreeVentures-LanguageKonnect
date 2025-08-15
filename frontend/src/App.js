import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EmailAutomation from "./pages/EmailAutomation";
import LivePods from "./pages/LivePods";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FoundersLifetimeAccessButton from "./components/FoundersLifetimeAccessButton/FoundersLifetimeAccessButton";
import SignupPage from "./components/SignUpPage/SignUpPage";
import Dashboard from "./components/Dashboard/Dashboard";
import LoginPage from "./components/LoginPage/LoginPage";
import AuthLayout from "./layout/AuthLayout";
import GuestLayout from "./layout/GuestLayout";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/email" element={<EmailAutomation />} />
				<Route path="/pods" element={<LivePods />} />

				{/* Guest only routes */}
				<Route
					path="/access"
					element={
						<GuestLayout>
							<FoundersLifetimeAccessButton />
						</GuestLayout>
					}
				/>
				<Route
					path="/login"
					element={
						<GuestLayout>
							<LoginPage />
						</GuestLayout>
					}
				/>
				<Route
					path="/signup"
					element={
						<GuestLayout>
							<SignupPage />
						</GuestLayout>
					}
				/>

				{/* Auth only routes */}
				<Route
					path="/dashboard"
					element={
						<AuthLayout>
							<Dashboard />
						</AuthLayout>
					}
				/>
			</Routes>
			<ToastContainer />
		</Router>
	);
}

export default App;
