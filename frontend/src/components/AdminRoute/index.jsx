import { Navigate } from "react-router";
import { useAuthenticateContext } from "../../context/AuthenticateContext";

const AdminRoute = ({ children }) => {
	const { authUser, isAuthChecked } = useAuthenticateContext();

	if (!isAuthChecked) {
		return <div>Loading...</div>; // Still checking token
	}
	const hasAccess = authUser?.roles === 'admin';
	return hasAccess ? children : <Navigate to="/" />;
}
export default AdminRoute;