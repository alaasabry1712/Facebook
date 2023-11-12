import { Form, Formik } from "formik"; // Import Formik's Form and Form components.
import { useState } from "react"; // Import the useState hook from React.
import RegisterInput from "../inputs/registerInput"; // Import a custom RegisterInput component.
import * as Yup from "yup"; // Import Yup for form validation.
import DateOfBirthSelect from "./DateOfBirthSelect"; // Import a custom DateOfBirthSelect component.
import GenderSelect from "./GenderSelect"; // Import a custom GenderSelect component.
import DotLoader from "react-spinners/DotLoader"; // Import the DotLoader component from the react-spinners library.
import axios from "axios"; // Import the axios library for making HTTP requests.
import { useDispatch } from "react-redux"; // Import the useDispatch hook for Redux state management.
import Cookies from "js-cookie"; // Import the js-cookie library for handling cookies.
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook for navigating through the website pages.

// Define the functional component RegisterForm, which takes a prop setVisible.
export default function RegisterForm({ setVisible }) {
    // Access the Redux dispatch function.
    const dispatch = useDispatch();

    // Access the navigation function for React Router.
    const navigate = useNavigate();

    // Initialize the user's information.
    const userInfo = {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        bYear: new Date().getFullYear(),
        bMonth: new Date().getMonth() + 1,
        bDay: new Date().getDate(),
        gender: "",
    };

    // Initialize the user state using the userInfo object.
    const [user, setUser] = useState(userInfo);

    // Destructure user information from the user state.
    const { first_name, last_name, email, password, bYear, bMonth, bDay, gender } = user;

    // Initialize the current year.
    const yearTemp = new Date().getFullYear();

    // Define a function to handle changes in the registration input fields.
    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    // Create arrays for years, months, and days for date of birth selection.
    const years = Array.from(new Array(108), (val, index) => yearTemp - index);
    const months = Array.from(new Array(12), (val, index) => 1 + index);

    // Function to calculate the number of days based on the selected year and month.
    const getDays = () => {
        return new Date(bYear, bMonth, 0).getDate();
    };

    // Create an array of days.
    const days = Array.from(new Array(getDays()), (val, index) => 1 + index);

    // Define a validation schema for the registration form using Yup.
    const registerValidation = Yup.object({
        first_name: Yup.string()
            .required("What's your First name?")
            .min(2, "First name must be between 2 and 16 characters.")
            .max(16, "First name must be between 2 and 16 characters.")
            .matches(/^[aA-zZ]+$/, "Numbers and special characters are not allowed."),
        last_name: Yup.string()
            .required("What's your Last name?")
            .min(2, "Last name must be between 2 and 16 characters.")
            .max(16, "Last name must be between 2 and 16 characters.")
            .matches(/^[aA-zZ]+$/, "Numbers and special characters are not allowed."),
        email: Yup.string()
            .required("You'll need this when you log in and if you ever need to reset your password.")
            .email("Enter a valid email address."),
        password: Yup.string()
            .required("Enter a combination of at least six numbers, letters, and punctuation marks (such as ! and &).")
            .min(6, "Password must be at least 6 characters.")
            .max(36, "Password can't be more than 36 characters"),
    });

    // Initialize state variables for date and gender validation.
    const [dateError, setDateError] = useState("");
    const [genderError, setGenderError] = useState("");

    // Initialize state variables for error, success, loading.
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    // Define the registerSubmit function to handle form submission.
    const registerSubmit = async () => {
        try {
            const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/register`, {
                first_name,
                last_name,
                email,
                password,
                bYear,
                bMonth,
                bDay,
                gender,
            });
            setError("");
            setSuccess(data.message);
            const { message, ...rest } = data;

            // Set a timeout to dispatch user data to Redux and set cookies before navigating.
            setTimeout(() => {
                dispatch({ type: "LOGIN", payload: rest });
                Cookies.set("user", JSON.stringify(rest));
                navigate("/");
            }, 2000);
        } catch (error) {
            setLoading(false);
            setSuccess("");
            setError(error.response.data.message);
        }
    };

    return (
        <div className="blur">
            <div className="register">
                <div className="register_header">
                    <i className="exit_icon" onClick={() => setVisible(false)}></i>
                    <span>Sign Up</span>
                    <span>it's quick and easy</span>
                </div>
                <Formik
                    enableReinitialize
                    initialValues={{
                        first_name,
                        last_name,
                        email,
                        password,
                        bYear,
                        bMonth,
                        bDay,
                        gender,
                    }}
                    validationSchema={registerValidation}
                    onSubmit={() => {
                        let current_date = new Date();
                        let picked_date = new Date(bYear, bMonth - 1, bDay);
                        let atleast14 = new Date(1970 + 14, 0, 1);
                        let noMoreThan70 = new Date(1970 + 70, 0, 1);

                        if (current_date - picked_date < atleast14) {
                            setDateError(
                                "It looks like you've entered the wrong info. Please make sure to use your real date of birth."
                            );
                        } else if (current_date - picked_date > noMoreThan70) {
                            setDateError(
                                "It looks like you've entered the wrong info. Please make sure to use your real date of birth."
                            );
                        } else if (gender === "") {
                            setDateError("");
                            setGenderError("Please choose a gender. You can change who can see this later.");
                        } else {
                            setDateError("");
                            setGenderError("");
                            registerSubmit();
                        }
                    }}
                >
                    {(formik) => (
                        <Form className="register_form">
                            <div className="reg_line">
                                <RegisterInput
                                    type="text"
                                    placeholder="First name"
                                    name="first_name"
                                    onChange={handleRegisterChange}
                                />
                                <RegisterInput
                                    type="text"
                                    placeholder="Surname"
                                    name="last_name"
                                    onChange={handleRegisterChange}
                                />
                            </div>
                            <div className="reg_line">
                                <RegisterInput
                                    type="text"
                                    placeholder="Mobile number or email address"
                                    name="email"
                                    onChange={handleRegisterChange}
                                />
                            </div>
                            <div className="reg_line">
                                <RegisterInput
                                    type="password"
                                    placeholder="New password"
                                    name="password"
                                    onChange={handleRegisterChange}
                                />
                            </div>
                            <div className="reg_col">
                                <div className="reg_line_header">
                                    Date of birth <i className="info_icon"></i>
                                </div>
                                <DateOfBirthSelect
                                    bDay={bDay}
                                    bMonth={bMonth}
                                    bYear={bYear}
                                    days={days}
                                    months={months}
                                    years={years}
                                    handleRegisterChange={handleRegisterChange}
                                    dateError={dateError}
                                />
                            </div>
                            <div className="reg_col">
                                <div className="reg_line_header">
                                    Gender <i className="info_icon"></i>
                                </div>
                                <GenderSelect handleRegisterChange={handleRegisterChange} genderError={genderError} />
                            </div>
                            <div className="reg_infos">
                                By clicking Sign Up, you agree to our <span>Terms, Data Policy &nbsp;</span>
                                and <span>Cookie Policy.</span> You may receive SMS notifications from us and can opt out at
                                any time.
                            </div>
                            <div className="reg_btn_wrapper">
                                <button className="blue_btn open_signup">Sign Up</button>
                            </div>
                            <DotLoader color="#1876f2" loading={loading} size={30} />
                            {error && <div className="error_text">{error}</div>}
                            {success && <div className="success_text">{success}</div>}
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
