import { Form, Formik } from "formik"; // Import Formik components for form handling
import { Link } from "react-router-dom"; // Import routing component for links
import LoginInput from "../../components/inputs/loginInput"; // Import a custom input component
import * as Yup from "yup"; // Import Yup for form validation
import axios from "axios"; // Import Axios for making HTTP requests to the server

export default function SearchAccount({
    email, // Current email state
    setEmail, // Function to set the email state
    error, // Error message state
    setError, // Function to set the error state
    setLoading, // Function to set loading state
    setuserInfo, // Function to set user information state
    setVisible, // Function to set the step visibility state
}) {
    const validateEmail = Yup.object({
        email: Yup.string()
            .required("Email address is required.")
            .email("Must be a valid email address.")
            .max(50, "Email address can't be more than 50 characters."),
    });

    const handleSearch = async () => {
        try {
            setLoading(true); // Set loading state to true

            // Send a POST request to find the user account based on the provided email
            const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/findUser`, { email });

            setuserInfo(data); // Set user information based on the response data
            setVisible(1); // Change the step visibility to the next step
            setError(""); // Clear any previous error message
            setLoading(false); // Set loading state back to false
        } catch (error) {
            setLoading(false); // Set loading state to false
            setError(error.response.data.message); // Set the error message based on the response data
        }
    };

    return (
        <div className="reset_form">
            <div className="reset_form_header">Find Your Account</div>
            <div className="reset_form_text">
                Please enter your email address or mobile number to search for your account.
            </div>

            {/* Formik form for email input and submission */}
            <Formik
                enableReinitialize
                initialValues={{
                    email,
                }}
                validationSchema={validateEmail}
                onSubmit={() => {
                    handleSearch();
                }}
            >
                {(formik) => (
                    <Form>
                        <LoginInput
                            type="text"
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email address or phone number"
                        />
                        {error && <div className="error_text">{error}</div>}

                        {/* Buttons for cancel and search actions */}
                        <div className="reset_form_btns">
                            <Link to="/login" className="gray_btn">
                                Cancel
                            </Link>
                            <button type="submit" className="blue_btn">
                                Search
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
