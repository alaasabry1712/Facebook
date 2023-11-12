import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DisplayAccessibility from "./DisplayAccessibility";
import HelpSupport from "./HelpSupport";
import SettingsPrivacy from "./SettingsPrivacy";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";

// This component displays a user menu with various options and submenus.
export default function UserMenu({ user }) {
    const dispatch = useDispatch(); // A function provided by Redux for dispatching actions.
    const navigate = useNavigate(); // A hook from React Router for navigation.
    const [visible, setVisible] = useState(0); // State to manage the visibility of submenus.

    // Function to handle user logout.
    const logout = () => {
        Cookies.set("user", ""); // Clear user data stored in cookies.
        // Dispatch a logout action to update the Redux state.
        dispatch({
            type: "LOGOUT",
        });
        navigate("/login"); // Navigate the user to the login page.
    };

    return (
        <div className="mmenu">
            {/* Main container for the user menu. */}
            {visible === 0 && (
                <div>
                    {/* Display user profile information and menu options when visible is 0. */}
                    <Link to="/profile" className="mmenu_header hover3">
                        {/* Link to the user's profile page. */}
                        <img src={user?.picture} alt="" />
                        <div className="mmenu_col">
                            <span>
                                {user?.first_name} {user?.last_name}
                            </span>
                            <span>See your profile</span>
                        </div>
                    </Link>
                    <div className="mmenu_splitter"></div>
                    <div className="mmenu_main inactive-link">
                        <div className="small_circle inactive-icon">
                            <i className="report_filled_icon"></i>
                        </div>
                        <div className="mmenu_col">
                            <div className="mmenu_span1">Give feedback</div>
                            <div className="mmenu_span1 inactive-link">Help us improve Facebook</div>
                        </div>
                    </div>
                    <div className="mmenu_splitter"></div>
                    <div className="mmenu_item  inactive-link">
                        <div className="small_circle inactive-icon">
                            <i className="settings_filled_icon"></i>
                        </div>
                        <span>Settings & privacy</span>
                        <div className="rArrow inactive-icon ">
                            <i className="right_icon"></i>
                        </div>
                    </div>
                    <div className="mmenu_item inactive-link">
                        <div className="small_circle inactive-icon">
                            <i className="help_filled_icon"></i>
                        </div>
                        <span>Help & support</span>
                        <div className="rArrow inactive-icon">
                            <i className="right_icon"></i>
                        </div>
                    </div>
                    <div
                        className="mmenu_item hover3"
                        onClick={() => {
                            setVisible(3);
                        }}
                    >
                        <div className="small_circle">
                            <i className="dark_filled_icon"></i>
                        </div>
                        <span>Display & Accessibility</span>
                        <div className="rArrow">
                            <i className="right_icon"></i>
                        </div>
                    </div>
                    <div
                        className="mmenu_item hover3"
                        onClick={() => {
                            logout();
                        }}
                    >
                        <div className="small_circle">
                            <i className="logout_filled_icon"></i>
                        </div>
                        <span>Logout</span>
                    </div>
                </div>
            )}
            {/* Display submenus based on the 'visible' state. */}
            {visible === 1 && <SettingsPrivacy setVisible={setVisible} />}
            {visible === 2 && <HelpSupport setVisible={setVisible} />}
            {visible === 3 && <DisplayAccessibility setVisible={setVisible} />}
        </div>
    );
}
