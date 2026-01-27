import { Navigate } from "react-router";
import { useAuthenticateContext } from "../../context/AuthenticateContext";

const AuthUserRoute = ({ children }) => {
    const { authUser, isAuthChecked } = useAuthenticateContext();

    if (!isAuthChecked) {
        return <div>Loading...</div>;
    }
    const hasAccess = authUser?.roles === "user";
    return hasAccess ? children : <Navigate to="/" />;
}
export default AuthUserRoute;