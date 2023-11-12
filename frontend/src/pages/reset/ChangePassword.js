import { Form, Formik } from "formik"; // Import Formik for form management
import { Link, useNavigate } from "react-router-dom"; // Import routing components for links and navigation
import LoginInput from "../../components/inputs/loginInput"; // Import the custom input component
import * as Yup from "yup"; // Import Yup for form validation
import axios from "axios"; // Import Axios for making HTTP requests

export default function ChangePassword({
    password, // State for the new password
    setPassword, // Function to set the new password
    conf_password, // State for confirming the new password
    setConf_password, // Function to set the confirming password
    error, // Error message state
    setLoading, // Function to set the loading state
    userInfo, // User information, including their email
    setError, // Function to set error state
}) {
    const navigate = useNavigate(); // Get the navigation function from React Router
    const validatePassword = Yup.object({
        password: Yup.string()
            .required("Enter a combination of at least six numbers, letters, and punctuation marks (such as ! and &).")
            .min(6, "Password must be at least 6 characters.")
            .max(36, "Password can't be more than 36 characters"),

        conf_password: Yup.string()
            .required("Confirm your password.")
            .oneOf([Yup.ref("password")], "Passwords must match."),
    });
    const { email } = userInfo; // Destructure the email from the user information

    const changePassword = async () => {
        try {
            setLoading(true); // Set loading state to true

            // Send a POST request to the backend to change the password using the email and the new password
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/changePassword`, {
                email,
                password,
            });

            setError(""); // Clear any previous error message
            navigate("/"); // Navigate to the home page after successful password change
        } catch (error) {
            setLoading(false); // Set loading state to false
            setError(error.response.data.message); // Set the error message based on the response data
        }
    };

    return (
        <div className="reset_form" style={{ height: "310px" }}>
            <div className="reset_form_header">Change Password</div>
            <div className="reset_form_text">Pick a strong password</div>

            <Formik
                enableReinitialize
                initialValues={{
                    password,
                    conf_password,
                }}
                validationSchema={validatePassword}
                onSubmit={() => {
                    changePassword();
                }}
            >
                {(formik) => (
                    <Form>
                        <LoginInput
                            type="password"
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="New password"
                        />
                        <LoginInput
                            type="password"
                            name="conf_password"
                            onChange={(e) => setConf_password(e.target.value)}
                            placeholder="Confirm new password"
                            bottom
                        />
                        {error && <div className="error_text">{error}</div>}

                        {/* Buttons for "Cancel" and "Continue" actions */}
                        <div className="reset_form_btns">
                            <Link to="/login" className="gray_btn">
                                Cancel
                            </Link>
                            <button type="submit" className="blue_btn">
                                Continue
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
