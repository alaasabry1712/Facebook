import axios from "axios"; // Import Axios for making HTTP requests
import { Link } from "react-router-dom"; // Import routing component for links

export default function SendEmail({
    userInfo, // User information retrieved from the previous step
    email, // Email address to send the reset code to
    error, // Error message state
    setError, // Function to set the error state
    setVisible, // Function to set the step visibility state
    setLoading, // Function to set loading state
}) {
    const sendEmail = async () => {
        try {
            setLoading(true); // Set loading state to true

            // Send a POST request to the backend to send a reset password code via email
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sendResetPasswordCode`, { email });

            setError(""); // Clear any previous error message
            setVisible(2); // Change the step visibility to the next step (entering the code)
            setLoading(false); // Set loading state back to false
        } catch (error) {
            setLoading(false); // Set loading state to false
            setError(error.response.data.message); // Set the error message based on the response data
        }
    };

    return (
        <div className="reset_form dynamic_height">
            <div className="reset_form_header">Reset Your Password</div>
            <div className="reset_grid">
                <div className="reset_left">
                    <div className="reset_form_text">How do you want to receive the code to reset your password?</div>
                    <label htmlFor="email" className="hover1">
                        <input type="radio" name="" id="email" checked readOnly />
                        <div className="label_col">
                            <span>Send code via email</span>
                            <span>{userInfo.email}</span>
                        </div>
                    </label>
                </div>
                <div className="reset_right">
                    <img src={userInfo.picture} alt="" />
                    <span>{userInfo.email}</span>
                    <span>Facebook user</span>
                </div>
            </div>
            {error && (
                <div className="error_text" style={{ padding: "10px" }}>
                    {error}
                </div>
            )}

            {/* Buttons for "Not You?" and "Continue" actions */}
            <div className="reset_form_btns">
                <Link to="/login" className="gray_btn">
                    Not You?
                </Link>
                <button
                    onClick={() => {
                        sendEmail();
                    }}
                    className="blue_btn"
                >
                    Continue
                </button>
            </div>
        </div>
    );
}
