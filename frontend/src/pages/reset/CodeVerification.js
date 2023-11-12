import { Form, Formik } from "formik"; // Import Formik for form management
import { Link } from "react-router-dom"; // Import routing component for links
import LoginInput from "../../components/inputs/loginInput"; // Import the custom input component
import * as Yup from "yup"; // Import Yup for form validation
import axios from "axios"; // Import Axios for making HTTP requests

export default function CodeVerification({
    code, // State for the verification code
    setCode, // Function to set the verification code
    error, // Error message state
    setLoading, // Function to set the loading state
    setVisible, // Function to set the step visibility state
    setError, // Function to set error state
    userInfo, // User information, including their email
}) {
    const validateCode = Yup.object({
        code: Yup.string()
            .required("Code is required")
            .min(5, "Code must be 5 characters.")
            .max(5, "Code must be 5 characters."),
    });

    const { email } = userInfo; // Destructure the email from the user information

    const verifyCode = async () => {
        try {
            setLoading(true); // Set loading state to true

            // Send a POST request to the backend to validate the reset code
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/validateResetCode`, { email, code });

            setVisible(3); // Change the step visibility to the next step (changing the password)
            setError(""); // Clear any previous error message
            setLoading(false); // Set loading state back to false
        } catch (error) {
            setLoading(false); // Set loading state to false
            setError(error.response.data.message); // Set the error message based on the response data
        }
    };

    return (
        <div className="reset_form">
            <div className="reset_form_header">Code verification</div>
            <div className="reset_form_text">Please enter the code that has been sent to your email.</div>

            <Formik
                enableReinitialize
                initialValues={{
                    code,
                }}
                validationSchema={validateCode}
                onSubmit={() => {
                    verifyCode();
                }}
            >
                {(formik) => (
                    <Form>
                        <LoginInput type="text" name="code" onChange={(e) => setCode(e.target.value)} placeholder="Code" />
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
