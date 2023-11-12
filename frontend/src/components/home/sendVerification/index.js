import { useState } from "react";
import "./style.css";
import axios from "axios";

export default function SendVerification({ user }) {
    // State variables to manage error and success messages
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Function to send a verification link
    const sendVerificationLink = async () => {
        try {
            // Make an HTTP POST request to send a verification link
            const { data } = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/sendVerification`, // Backend endpoint for sending verification
                {},
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`, // Include the user's token for authorization
                    },
                }
            );

            // If the request is successful, update the success message
            setSuccess(data.message);
        } catch (error) {
            // If there's an error, update the error message
            setError(error.response.data.message);
        }
    };

    return (
        <div className="send_verification">
            {/* Display a message about the unverified account */}
            <span>
                Your account is not verified, verify your account before it gets deleted after a month from creating.
            </span>

            {/* Anchor element for resending verification link */}
            <a
                // When clicked, trigger the sendVerificationLink function
                onClick={() => {
                    sendVerificationLink();
                }}
            >
                Click here to resend the verification link
            </a>

            {/* Display a success message if available */}
            {success && <div className="success_text">{success}</div>}

            {/* Display an error message if available */}
            {error && <div className="error_text">{error}</div>}
        </div>
    );
}
