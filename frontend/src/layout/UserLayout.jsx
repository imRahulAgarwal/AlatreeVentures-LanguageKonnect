import { Outlet } from "react-router";
import Header from "../components/Header/Header";

const UserLayout = ({ isLoggedIn }) => {
	return (
		<div className="d-flex flex-column position-relative h-100 w-100">
			<Header isAuthenticated={isLoggedIn} />
			<Outlet />
		</div>
	);
};

export default UserLayout;
