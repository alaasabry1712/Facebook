import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

// Component for handling routing when a user is not logged in.
export default function NotLoggedInRoutes() {
    const { user } = useSelector((state) => ({ ...state }));
    // Extract user information from the Redux store using the useSelector hook.

    // If a user exists (user is logged in), redirect to the home page using Navigate.
    // If there is no user (user is not logged in), render the nested routes using Outlet.
    return user ? <Navigate to="/" /> : <Outlet />;
}
