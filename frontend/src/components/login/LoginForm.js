import { Formik, Form } from "formik"; // Import Formik's Formik and Form components.
import { Link } from "react-router-dom"; // Import the Link component from React Router.
import * as Yup from "yup"; // Import Yup for form validation.
import LoginInput from "../../components/inputs/loginInput"; // Import our custom LoginInput component.
import { useState } from "react"; // Import the useState hook from React.
import DotLoader from "react-spinners/DotLoader"; // Import the DotLoader component from the react-spinners library.
import axios from "axios"; // Import the axios library for making HTTP requests to the server.
import { useDispatch } from "react-redux"; // Import the useDispatch hook for Redux state management.
import Cookies from "js-cookie"; // Import the js-cookie library for handling cookies.
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook for navigating through the website pages.

// Define the functional component LoginForm, which takes a prop setVisible.
export default function LoginForm({ setVisible }) {
    // Define an initial state for login information.
    const loginInfo = {
        email: "",
        password: "",
    };

    // Access the Redux dispatch function.
    const dispatch = useDispatch();

    // Access the navigation function for React Router.
    const navigate = useNavigate();

    // Initialize the login state using the loginInfo object.
    const [login, setLogin] = useState(loginInfo);

    // Destructure email and password from the login state.
    const { email, password } = login;

    // Define a function to handle changes in the login input fields.
    const handleLoginChange = (e) => {
        // Destructure the 'name' and 'value' properties from the input element's event target
        const { name, value } = e.target;

        // Update the 'login' state object by creating a new object with the existing properties
        // ('...login') and dynamically setting the property specified by 'name' to the 'value'
        setLogin({ ...login, [name]: value });
    };

    // Define a validation schema for the login form using Yup.
    const loginValidation = Yup.object({
        email: Yup.string().required("Email address is required.").email("Please enter a valid email.").max(100),
        password: Yup.string().required("Password is required"),
    });

    // Initialize state variables for error and loading.
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Define the loginSubmit function to handle form submission.
    const loginSubmit = async () => {
        try {
            // Set loading to true to indicate a request is in progress.
            setLoading(true);

            // Make a POST request to the backend with user's email and password.
            /* The response from the POST request is an object that typically contains various properties, 
            including the data property. The data property usually holds the actual response data from the server, 
            such as the user's information or any other data relevant to the request. */
            const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`, {
                email,
                password,
            });

            // Dispatch a Redux action to update the user's state.
            dispatch({ type: "LOGIN", payload: data });

            // Store user data in cookies for persistent login.
            Cookies.set("user", JSON.stringify(data));

            // Redirect the user to the home page ("/").
            navigate("/");
        } catch (error) {
            // If there's an error in the request, set loading to false and display the error message.
            setLoading(false);
            setError(error.response.data.message);
        }
    };

    return (
        <div className="login_wrap">
            <div className="login_1">
                <img src="../../icons/facebook.svg" alt="" />
                <span>Facebook helps you connect and share with the people in your life.</span>
            </div>
            <div className="login_2">
                <div className="login_2_wrap">
                    {/* Formik component for handling form state and validation */}
                    <Formik
                        enableReinitialize // Allows reinitialization of form fields when components re-render
                        initialValues={{
                            email, // Initialize email from state
                            password, // Initialize password from state
                        }}
                        validationSchema={loginValidation} // Apply the validation schema defined using Yup
                        onSubmit={() => {
                            loginSubmit(); // Call the loginSubmit function when the form is submitted
                        }}
                    >
                        {(formik) => (
                            <Form>
                                {/* LoginInput components for email and password */}
                                <LoginInput
                                    type="text"
                                    name="email"
                                    placeholder="Email address or phone number"
                                    onChange={handleLoginChange} // Call handleLoginChange when input value changes
                                />
                                <LoginInput
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    onChange={handleLoginChange}
                                    bottom // Add a visual distinction to the bottom of the password input
                                />
                                <button type="submit" className="blue_btn">
                                    Log In
                                </button>
                            </Form>
                        )}
                    </Formik>
                    {/* Link to the password reset page */}
                    <Link to="/reset" className="forgot_password">
                        Forgotten password? {/* Clicking this link navigates to the "Password Reset" page */}
                    </Link>
                    {/* Loading spinner (DotLoader) */}
                    <DotLoader
                        color="#1876f2" // Set the color of the loading spinner
                        loading={loading} // Display the spinner if the loading state is true
                        size={30} // Set the size of the loading spinner
                    />
                    {/* Display an error message if there is one */}
                    {error && <div className="error_text">{error}</div>}
                    <div className="sign_splitter"></div> {/* A visual divider or separator */}
                    {/* Button to open the signup form */}
                    <button className="blue_btn open_signup" onClick={() => setVisible(true)}>
                        Create Account {/* Clicking this button triggers the signup form to become visible */}
                    </button>
                </div>

                {/* Link to create a page */}
                <Link to="/" className="sign_extra">
                    <b>Create a Page</b> for a celebrity, brand, or business.
                </Link>
            </div>
        </div>
    );
}
