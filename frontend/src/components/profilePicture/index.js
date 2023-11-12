import "./style.css";
import { useRef, useState } from "react";
import UpdateProfilePicture from "./UpdateProfilePicture";
import { useSelector } from "react-redux";

export default function ProfilePicture({ username, setShow, pRef, photos }) {
    const popup = useRef(null); // Reference to the popup element
    const { user } = useSelector((state) => ({ ...state })); // Retrieve user data from Redux store
    const refInput = useRef(null); // Reference to the file input element
    const [image, setImage] = useState(""); // State variable to hold the selected image
    const [error, setError] = useState(""); // State variable for displaying error messages

    // Function to handle image selection
    const handleImage = (e) => {
        let file = e.target.files[0]; // Retrieve the selected file
        if (
            file.type !== "image/jpeg" &&
            file.type !== "image/png" &&
            file.type !== "image/webp" &&
            file.type !== "image/gif"
        ) {
            setError(`${file.name} format is not supported.`); // Set an error message if the format is not supported
            return;
        } else if (file.size > 1024 * 1024 * 5) {
            setError(`${file.name} is too large max 5mb allowed.`); // Set an error message if the file size exceeds the limit
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file); // Read the file as a data URL
        reader.onload = (event) => {
            setImage(event.target.result); // Set the selected image as the 'image' state
        };
    };

    return (
        <div className="blur">
            <input
                type="file" // Specifies that this input element is for selecting a file
                ref={refInput} // A reference to this input element to access it programmatically
                hidden // Makes the input element invisible
                onChange={handleImage} // Calls the 'handleImage' function when a file is selected
                accept="image/jpeg,image/png,image/webp,image/gif" // Accepts files with specified image formats
            />

            {/* This div represents the container for updating the profile picture */}
            <div className="postBox pictureBox" ref={popup}>
                {/* This div contains the header section with the close button and title */}
                <div className="box_header">
                    {/* This div with a close button icon is used to close the profile picture update */}
                    <div className="small_circle" onClick={() => setShow(false)}>
                        <i className="exit_icon"></i>
                    </div>
                    <span>Update profile picture</span> {/* Title for the profile picture update */}
                </div>
                <div className="update_picture_wrap">
                    {/* This div contains the buttons for updating the profile picture */}
                    <div className="update_picture_buttons">
                        {/* Button to trigger file input for uploading a new profile picture */}
                        <button className="light_blue_btn" onClick={() => refInput.current.click()}>
                            <i className="plus_icon filter_blue"></i> Upload photo
                        </button>
                        {/* Button for adding a frame to the profile picture */}
                        <button className="gray_btn">
                            <i className="frame_icon"></i> Add frame
                        </button>
                    </div>
                </div>
                {/* Error message and button to try again in case of an error */}
                {error && (
                    <div className="postError comment_error">
                        <div className="postError_error">{error}</div>
                        <button className="blue_btn" onClick={() => setError("")}>
                            Try again
                        </button>
                    </div>
                )}
                {/* Container for displaying old profile pictures */}
                <div className="old_pictures_wrap scrollbar">
                    <h4>your profile pictures</h4>
                    {/* Container for old profile pictures */}
                    <div className="old_pictures">
                        {/* Display old profile pictures, allowing selection to set as the new profile picture */}
                        {photos
                            .filter((img) => img.folder === `${user.username}/profile_pictures`)
                            .map((photo) => (
                                <img
                                    src={photo.secure_url}
                                    key={photo.public_id}
                                    alt=""
                                    onClick={() => setImage(photo.secure_url)}
                                />
                            ))}
                    </div>
                    <h4>other pictures</h4>
                    {/* Container for other pictures not used as the profile picture */}
                    <div className="old_pictures">
                        {/* Display other pictures, allowing selection to set as the new profile picture (post pictures) */}
                        {photos
                            .filter((img) => img.folder !== `${user.username}/profile_pictures`)
                            .map((photo) => (
                                <img
                                    src={photo.secure_url}
                                    key={photo.public_id}
                                    alt=""
                                    onClick={() => setImage(photo.secure_url)}
                                />
                            ))}
                    </div>
                </div>
            </div>

            {/* Conditional rendering of the UpdateProfilePicture component based on the 'image' state. */}
            {image && (
                <UpdateProfilePicture setImage={setImage} image={image} setShow={setShow} setError={setError} pRef={pRef} />
            )}
        </div>
    );
}
