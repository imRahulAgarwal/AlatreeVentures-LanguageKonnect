import { Outlet } from "react-router";

const UserLayout = () => {
	return (
		<div className="d-flex flex-column position-relative h-100 w-100">
			<Outlet />
		</div>
	);
};

export default UserLayout;
