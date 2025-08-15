import { Navigate } from "react-router-dom";

const GuestLayout = ({ children }) => {
	const token = localStorage.getItem("token");
	return token ? <Navigate to="/dashboard" /> : children;
};

export default GuestLayout;
