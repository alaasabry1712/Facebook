import "./style.css";
import LoginForm from "../../components/login/LoginForm";
import Footer from "../../components/login/Footer";
import RegisterForm from "../../components/login/RegisterForm";
import { useState } from "react";

export default function Login() {
    // State to control the visibility of the registration form
    const [visible, setVisible] = useState(false);

    return (
        <div className="login">
            <div className="login_wrapper">
                {/* Display the login form component and pass a function to control visibility of the registration form */}
                <LoginForm setVisible={setVisible} />

                {/* Display the registration form if 'visible' is true */}
                {visible && <RegisterForm setVisible={setVisible} />}

                {/* Display the footer component */}
                <Footer />
            </div>
        </div>
    );
}
