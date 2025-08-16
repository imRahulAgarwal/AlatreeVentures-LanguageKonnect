import React, { useEffect, useState } from "react";
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from "react-router";
import Home from "./Home";
import { ToastContainer } from "react-toastify";
import UserLayout from "./layout/UserLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import axios from "axios";
import { apiUrl } from "./configs/envExport";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Payment from "./pages/Payment/Payment";
import Terms from "./pages/Terms/Terms";
import Privacy from "./pages/Privacy/Privacy";
import ReferralRedirect from "./pages/Referral/ReferralRedirect";
import Referrals from "./pages/Referrals/Referrals";

const App = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [user, setUser] = useState(null);
	const token = localStorage.getItem("token");

	useEffect(() => {
		const getUserData = async () => {
			if (token) {
				try {
					const result = await axios.get(`${apiUrl}/api/users/profile`, {
						headers: { Authorization: `Bearer ${token}` },
					});

					const responseData = result.data;
					if (responseData.success) {
						setIsLoggedIn(true);
						setUser(responseData.user);
					} else {
						setIsLoggedIn(false);
						setUser(null);
					}
				} catch (error) {
					console.error(error);
					setIsLoggedIn(false);
					setUser(null);
				}
			} else {
				setIsLoggedIn(false);
				setUser(null);
			}

			setIsLoading(false);
		};

		getUserData();
	}, [token]);

	if (isLoading) {
		return <h1>Loading</h1>;
	}

	const router = createBrowserRouter(
		createRoutesFromElements(
			<Route path="/" element={<UserLayout isLoggedIn={isLoggedIn} />}>
				<Route index element={<Home isLoggedIn={isLoggedIn} />} />
				<Route path="terms" element={<Terms />} />
				<Route path="privacy" element={<Privacy />} />
				{isLoggedIn ? (
					<>
						<Route path="dashboard" element={<Dashboard user={user} />} />
						<Route path="referrals" element={<Referrals user={user} />} />
					</>
				) : (
					<>
						<Route path="/refer" element={<ReferralRedirect />} />
						<Route path="register" element={<Register />} />
						<Route path="login" element={<Login />} />
						<Route path="access" element={<Payment />} />
					</>
				)}
				<Route path="*" element={<Navigate to="/" />} />
			</Route>
		)
	);

	return (
		<>
			<RouterProvider router={router} />
			<ToastContainer />
		</>
	);
};

export default App;
