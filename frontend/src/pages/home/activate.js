import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import CreatePost from "../../components/createPost";
import Header from "../../components/header";
import LeftHome from "../../components/home/left";
import RightHome from "../../components/home/right";
import Stories from "../../components/home/stories";
import ActivateForm from "./ActivateForm";
import "./style.css";
import axios from "axios";
import Cookies from "js-cookie";

export default function Activate() {
    // Redux-related variables
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((user) => ({ ...user }));

    // Component state variables
    const [success, setSuccess] = useState(""); // Success message
    const [error, setError] = useState(""); // Error message
    const [loading, setLoading] = useState(true); // Loading state

    // Extracts the token from the URL parameters
    const { token } = useParams();

    // useEffect hook to activate the account when the component mounts
    useEffect(() => {
        activateAccount();
    }, []);

    // Function to send a request to activate the user's account
    const activateAccount = async () => {
        try {
            setLoading(true);

            // Send a POST request to the backend with the activation token
            //while also making sure that the user is authinticated bu sending the token in the headers
            const { data } = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/activate`,
                { token },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );

            // Update the success message and set the user as verified
            setSuccess(data.message);
            Cookies.set("user", JSON.stringify({ ...user, verified: true }));
            dispatch({
                type: "VERIFY",
                payload: true,
            });

            // Redirect to the home page after a delay
            setTimeout(() => {
                navigate("/");
            }, 3000);
        } catch (error) {
            // Handle errors, update the error message, and redirect to the home page
            setError(error.response.data.message);
            setTimeout(() => {
                navigate("/");
            }, 3000);
        }
    };

    return (
        <>
            <div className="home">
                {success && (
                    <ActivateForm type="success" header="Account verification succeeded." text={success} loading={loading} />
                )}
                {error && <ActivateForm type="error" header="Account verification failed." text={error} loading={loading} />}

                {/* Render the header and main content */}
                <Header />
                <LeftHome user={user} />
                <div className="home_middle">
                    <Stories />
                    <CreatePost user={user} />
                </div>
                <RightHome user={user} />
            </div>
        </>
    );
}
