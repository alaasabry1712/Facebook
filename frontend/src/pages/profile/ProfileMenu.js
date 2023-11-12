import { a } from "react-router-dom";
import { Dots } from "../../svg";

export default function ProfileMenu() {
    return (
        <div className="profile_menu_wrap">
            {/* Container for the profile menu. */}
            <div className="profile_menu">
                {/* Profile menu options */}
                <a className="profile_menu_active">Posts</a>
                <a className=" inactive-link">About</a>
                <a className=" inactive-link">Friends</a>
                <a className=" inactive-link">Photos</a>
                <a className=" inactive-link">Videos</a>
                <a className=" inactive-link">Check-ins</a>
                <a className=" inactive-link">More</a>
                <div className="p10_dots inactive-icon">
                    {/* Dots icon or button for additional actions. */}
                    <Dots />
                </div>
            </div>
        </div>
    );
}
