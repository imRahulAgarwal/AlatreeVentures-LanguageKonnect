import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

const ReferralRedirect = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	useEffect(() => {
		const referralCode = searchParams.get("referralCode");
		navigate(`/access?referralCode=${referralCode}`);
	}, [navigate, searchParams]);

	return <div>Redirecting...</div>;
};

export default ReferralRedirect;
