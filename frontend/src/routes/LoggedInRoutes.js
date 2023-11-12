import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Login from "../pages/login";

// Component for handling routing when a user is logged in.
export default function LoggedInRoutes() {
    // Extract user information from the Redux store using the useSelector hook.
    const { user } = useSelector((state) => ({ ...state }));

    // If a user exists (user is logged in), render the nested routes using Outlet.
    // If there is no user (user is not logged in), redirect to the Login page.
    return user ? <Outlet /> : <Login />;
}
