import "./style.css"; // Import CSS styles
import { Link, useNavigate } from "react-router-dom"; // Import routing components
import { useDispatch, useSelector } from "react-redux"; // Import Redux hooks for state management
import Cookies from "js-cookie"; // Import a library for working with cookies
import { useState } from "react"; // Import React hook for managing component state
import SearchAccount from "./SearchAccount"; // Import subcomponent for searching for an account
import SendEmail from "./SendEmail"; // Import subcomponent for sending a verification email
import CodeVerification from "./CodeVerification"; // Import subcomponent for code verification
import ChangePassword from "./ChangePassword"; // Import subcomponent for changing the password
import Footer from "../../components/login/Footer"; // Import a footer component

export default function Reset() {
    const { user } = useSelector((state) => ({ ...state })); // Get user information from Redux state
    const dispatch = useDispatch(); // Access the Redux dispatch function
    const navigate = useNavigate(); // Get access to the navigation function
    const [visible, setVisible] = useState(0); // State variable to manage the visibility of different steps
    const [Loading, setLoading] = useState(false); // State variable to manage loading state
    const [email, setEmail] = useState(""); // State variable to store email input
    const [code, setCode] = useState(""); // State variable to store code input
    const [password, setPassword] = useState(""); // State variable to store password input
    const [conf_password, setConf_password] = useState(""); // State variable to store password confirmation input
    const [error, setError] = useState(""); // State variable to manage error messages
    const [userInfo, setuserInfo] = useState(""); // State variable to store user information for the reset process

    // Function to log the user out
    const logout = () => {
        Cookies.set("user", ""); // Clear the user's cookie
        dispatch({
            type: "LOGOUT", // Dispatch a Redux action to log the user out
        });
        navigate("/login"); // Redirect the user to the login page
    };

    return (
        <>
            <div className="reset">
                {/* Header section */}
                <div className="reset_header">
                    <img src="../../../icons/facebook.svg" alt="" />
                    {user ? (
                        // If user is logged in, show profile link and logout button
                        <div className="right_reset">
                            <Link to="/profile">
                                <img src={user.picture} alt="" />
                            </Link>
                            <button
                                className="blue_btn"
                                onClick={() => {
                                    logout();
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        // If user is not logged in, show login button
                        <Link to="/login" className="right_reset">
                            <button className="blue_btn">Login</button>
                        </Link>
                    )}
                </div>

                {/* Reset process steps */}
                <div className="reset_wrap">
                    {visible === 0 && (
                        // Step 1: Search for an account
                        <SearchAccount
                            email={email}
                            setEmail={setEmail}
                            error={error}
                            setError={setError}
                            setLoading={setLoading}
                            setuserInfo={setuserInfo}
                            setVisible={setVisible}
                        />
                    )}
                    {visible === 1 && userInfo && (
                        // Step 2: Send a verification email
                        <SendEmail
                            email={email}
                            userInfo={userInfo}
                            error={error}
                            setError={setError}
                            setLoading={setLoading}
                            setuserInfo={setuserInfo}
                            setVisible={setVisible}
                        />
                    )}
                    {visible === 2 && (
                        // Step 3: Verify a code
                        <CodeVerification
                            user={user}
                            code={code}
                            setCode={setCode}
                            error={error}
                            setError={setError}
                            setLoading={setLoading}
                            setVisible={setVisible}
                            userInfo={userInfo}
                        />
                    )}
                    {visible === 3 && (
                        // Step 4: Change the password
                        <ChangePassword
                            password={password}
                            conf_password={conf_password}
                            setConf_password={setConf_password}
                            setPassword={setPassword}
                            error={error}
                            setError={setError}
                            setLoading={setLoading}
                            setVisible={setVisible}
                            userInfo={userInfo}
                        />
                    )}
                </div>

                {/* Footer section */}
                <Footer />
            </div>
        </>
    );
}
