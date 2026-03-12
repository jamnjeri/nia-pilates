import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, accessToken } = useSelector((state) => state.auth);

    if (!isLoggedIn && !accessToken) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
