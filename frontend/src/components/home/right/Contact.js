import { Link } from "react-router-dom";
export default function Contact({ user }) {
    return (
        <Link to="/profile">
            <div className="contact hover3">
                <div className="contact_img">
                    <img src={user.picture} alt="" />
                </div>
                <span>
                    {user.first_name} {user.last_name}
                </span>
            </div>
        </Link>
    );
}
