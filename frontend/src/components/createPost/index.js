import "./style.css";
import { Feeling, LiveVideo, Photo } from "../../svg";

export default function CreatePost({ user, setVisible, profile }) {
    return (
        <div className="createPost">
            {/* Root container with the "createPost" CSS class. */}
            <div className="createPost_header">
                {/* Header section for the post. */}
                <img src={user?.picture} alt="" /> {/* Displaying the user's profile picture, if available. */}
                <div
                    className="open_post hover2"
                    onClick={() => {
                        setVisible(true);
                    }}
                >
                    {/* Displaying the user's first name and a text input area for the post. */}
                    What's on your mind, {user?.first_name}
                </div>
            </div>
            <div className="create_splitter"></div> {/* A horizontal line that separates the header and body of the post. */}
            <div className="createPost_body">
                {/* Body section for the post. */}
                <div className="createPost_icon  inactive-icon">
                    <LiveVideo color="#f3425f" /> {/* Displaying a Live Video icon with a specific color. */}
                    Live Video
                </div>
                <div className="createPost_icon  inactive-icon">
                    <Photo color="#4bbf67" /> {/* Displaying a Photo/Video icon with a specific color. */}
                    Photo/Video
                </div>
                {profile ? (
                    <div className="createPost_icon inactive-icon">
                        <i className="lifeEvent_icon"></i> {/* Displaying an icon for Life Event. */}
                        Life Event
                    </div>
                ) : (
                    <div className="createPost_icon inactive-icon">
                        <Feeling color="#f7b928" /> {/* Displaying a Feeling/Activity icon with a specific color. */}
                        Feeling/Activity
                    </div>
                )}
            </div>
        </div>
    );
}
