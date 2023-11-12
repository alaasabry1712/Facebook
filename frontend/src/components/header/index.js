import "./style.css";
import { Link } from "react-router-dom";
import {
    ArrowDown,
    Friends,
    FriendsActive,
    Gaming,
    Home,
    HomeActive,
    Logo,
    Market,
    Menu,
    Messenger,
    Notifications,
    Search,
    Watch,
} from "../../svg";
import { useSelector } from "react-redux";
import SearchMenu from "./SearchMenu";
import { useRef, useState } from "react";
import AllMenu from "./AllMenu";
import useClickOutside from "../../helpers/clickOutside";
import UserMenu from "./userMenu";

// Header component displays the Facebook header, including the logo, navigation icons, and user profile.
export default function Header({ page, getAllPosts }) {
    const { user } = useSelector((user) => ({ ...user })); // Retrieve user information from Redux state.
    const color = "#65676b"; // Set the default color for icons.
    const [showSearchMenu, setShowSearchMenu] = useState(false); // State to control the visibility of the search menu.
    const [showAllMenu, setShowAllMenu] = useState(false); // State to control the visibility of the all menu.
    const [showUserMenu, setShowUserMenu] = useState(false); // State to control the visibility of the user menu.
    const allmenu = useRef(null); // Ref for the all menu to detect clicks outside the menu.
    const usermenu = useRef(null); // Ref for the user menu to detect clicks outside the menu.

    // Custom hook to handle clicks outside the all menu and user menu.
    useClickOutside(allmenu, () => {
        setShowAllMenu(false);
    });
    useClickOutside(usermenu, () => {
        setShowUserMenu(false);
    });

    return (
        <header>
            <div className="header_left">
                {/* Facebook logo with a link to the home page. */}
                <Link to="/" className="header_logo">
                    <div className="circle">
                        <Logo />
                    </div>
                </Link>
                <div
                    className="search search1"
                    onClick={() => {
                        setShowSearchMenu(true);
                    }}
                >
                    <Search color={color} />
                    {/* Search input with a placeholder. */}
                    <input type="text" placeholder="Search Facebook" className="hide_input" />
                </div>
            </div>

            {showSearchMenu && (
                // Display the search menu when showSearchMenu is true.
                <SearchMenu color={color} setShowSearchMenu={setShowSearchMenu} token={user.token} />
            )}

            <div className="header_middle">
                <Link
                    to="/"
                    className={`middle_icon ${page === "home" ? "active" : "hover1"}`}
                    onClick={() => getAllPosts()}
                >
                    {page === "home" ? <HomeActive /> : <Home color={color} />}
                </Link>
                <Link to="/friends" className={`middle_icon ${page === "friends" ? "active" : "hover1"}`}>
                    {page === "friends" ? <FriendsActive /> : <Friends color={color} />}
                </Link>
                <Link to="/" className="middle_icon  inactive-icon inactive-link">
                    <Watch color={color} />
                    <div className="middle_notification">9+</div>
                    {/* Watch icon with a notification count. */}
                </Link>
                <Link to="/" className="middle_icon  inactive-icon">
                    <Market color={color} />
                </Link>
                <Link to="/" className="middle_icon  inactive-icon">
                    <Gaming color={color} />
                </Link>
            </div>

            <div className="header_right">
                <Link to="/profile" className={`profile_link hover1 ${page === "profile" ? "active_link" : ""}`}>
                    {/* User profile link with an active style if on the profile page. */}
                    <img src={user?.picture} alt="" />
                    <span>{user?.first_name}</span>
                </Link>

                <div
                    className={`inactive-link inactive-icon circle_icon  ${showAllMenu && "active_header"}`}
                    ref={allmenu}
                >
                    <div>
                        <div style={{ transform: "translateY(2px)" }}>
                            <Menu />
                        </div>
                    </div>

                    {showAllMenu && <AllMenu />}
                    {/* Display the "All Menu" when showAllMenu is true. */}
                </div>

                <div className="circle_icon  inactive-icon">
                    <Messenger />
                </div>

                <div className="circle_icon inactive-icon">
                    <Notifications />
                    <div className="right_notification">5</div>
                    {/* Notifications icon with a notification count. */}
                </div>

                <div className={`circle_icon hover1 ${showUserMenu && "active_header"}`} ref={usermenu}>
                    <div
                        onClick={() => {
                            setShowUserMenu((prev) => !prev);
                        }}
                    >
                        <div style={{ transform: "translateY(2px)" }}>
                            <ArrowDown />
                        </div>
                    </div>

                    {showUserMenu && <UserMenu user={user} />}
                    {/* Display the "User Menu" when showUserMenu is true. */}
                </div>
            </div>
        </header>
    );
}
