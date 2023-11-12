import { useRef, useState } from "react"; // Importing React hooks for managing component state.
import EmojiPickerBackgrounds from "./EmojiPickerBackgrounds"; // Importing a custom component for emoji picker backgrounds.
import AddToYourPost from "./AddToYourPost"; // Importing a custom component for adding to your post.
import ImagePreview from "./ImagePreview"; // Importing a custom component for image preview.
import useClickOutside from "../../helpers/clickOutside"; // Importing a custom hook for handling clicks outside a component.
import { createPost } from "../../functions/post"; // Importing a function for creating a post.
import PulseLoader from "react-spinners/PulseLoader"; // Importing a loading spinner component.
import PostError from "./PostError"; // Importing a custom component for displaying post errors.
import dataURItoBlob from "../../helpers/dataURItoBlob"; // Importing a utility function for converting data URIs to Blobs.
import { uploadImages } from "../../functions/uploadImages"; // Importing a function for uploading images.
import "./style.css"; // Importing a CSS file for styling.

export default function CreatePostPopup({ user, setVisible, posts, dispatch, profile }) {
    const popup = useRef(null); // Creating a ref for the popup element.
    const [text, setText] = useState(""); // Managing state for post text.
    const [showPrev, setShowPrev] = useState(false); // Managing state for showing image preview.
    const [loading, setLoading] = useState(false); // Managing state for loading state.
    const [error, setError] = useState(""); // Managing state for post errors.
    const [images, setImages] = useState([]); // Managing state for post images.
    const [background, setBackground] = useState(""); // Managing state for post backgrounds.

    useClickOutside(popup, () => {
        setVisible(false); // Handling clicks outside the popup by setting it to invisible.
    });

    const postSubmit = async () => {
        if (background) {
            // If there is a background image selected:
            setLoading(true); // Set loading state to indicate the post is being processed.
            const response = await createPost(null, background, text, null, user.id, user.token);
            setLoading(false); // Clear the loading state after the post request.
            if (response.status === "ok") {
                // If the post creation is successful:
                dispatch({
                    type: profile ? "PROFILE_POSTS" : "POSTS_SUCCESS",
                    payload: [response.data, ...posts], // Add the new post to the list of posts.
                });
                setBackground(""); // Clear the background image input.
                setText(""); // Clear the text input.
                setVisible(false); // Hide the post creation form.
            } else {
                setError(response); // Set an error state with the response data.
            }
        } else if (images && images.length) {
            // If there are additional images selected:
            // (Note: it's checking if 'images' is truthy and has a length)
            setLoading(true);
            const postImages = images.map((img) => {
                return dataURItoBlob(img);
            });
            const path = `${user.username}/post_images`;
            let formData = new FormData();
            formData.append("path", path);
            postImages.forEach((image) => {
                formData.append("file", image);
            });
            const response = await uploadImages(formData, path, user.token);

            const res = await createPost(null, null, text, response, user.id, user.token);
            setLoading(false);
            if (res.status === "ok") {
                dispatch({
                    type: profile ? "PROFILE_POSTS" : "POSTS_SUCCESS",
                    payload: [res.data, ...posts],
                });
                setText("");
                setImages(""); // Clear the additional images input.
                setVisible(false);
            } else {
                setError(res);
            }
        } else if (text) {
            // If there is only text content without images or background:
            setLoading(true);
            const response = await createPost(null, null, text, null, user.id, user.token);
            setLoading(false);
            if (response.status === "ok") {
                dispatch({
                    type: profile ? "PROFILE_POSTS" : "POSTS_SUCCESS",
                    payload: [response.data, ...posts],
                });
                setBackground("");
                setText(""); // Clear the text input.
                setVisible(false);
            } else {
                setError(response);
            }
        } else {
            // If none of the above conditions are met:
            console.log("nothing"); // Log a message indicating no action was taken.
        }
    };

    return (
        <div className="blur">
            {/* A blurred background for the popup. */}
            <div className="postBox" ref={popup}>
                {/* The main post creation box. */}
                {error && <PostError error={error} setError={setError} />}
                {/* Display the error message if there's an error. */}
                <div className="box_header">
                    {/* Header section of the popup. */}
                    <div
                        className="small_circle"
                        onClick={() => {
                            setVisible(false); // Close the popup when the 'x' button is clicked.
                        }}
                    >
                        <i className="exit_icon"></i> {/* Display an exit icon. */}
                    </div>
                    <span>Create Post</span> {/* Title of the popup. */}
                </div>
                <div className="box_profile">
                    {/* User profile section. */}
                    <img src={user.picture} alt="" className="box_profile_img" /> {/* Display the user's profile picture. */}
                    <div className="box_col">
                        <div className="box_profile_name">
                            {user.first_name} {user.last_name}
                        </div>
                        {/* Display the user's name. */}
                        <div className="box_privacy inactive-icon">
                            <img src="../../../icons/public.png" alt="" />
                            {/* Display a privacy icon (you might want to use the correct image path). */}
                            <span>Public</span> {/* Set the privacy status to 'Public'. */}
                            <i className="arrowDown_icon"></i> {/* Display an arrow down icon. */}
                        </div>
                    </div>
                </div>
                {!showPrev ? ( // Conditional rendering based on whether to show the image preview.
                    <>
                        <EmojiPickerBackgrounds
                            text={text}
                            user={user}
                            setText={setText}
                            showPrev={showPrev}
                            setBackground={setBackground}
                            background={background}
                        />
                        {/* Display the emoji picker and background selector. */}
                    </>
                ) : (
                    <ImagePreview
                        text={text}
                        user={user}
                        setText={setText}
                        showPrev={showPrev}
                        images={images}
                        setImages={setImages}
                        setShowPrev={setShowPrev}
                        setError={setError}
                        setBackground={setBackground}
                    />
                )}
                <AddToYourPost setShowPrev={setShowPrev} /> {/* Component for adding to your post. */}
                <button
                    className="post_submit"
                    onClick={() => {
                        postSubmit(); // Handle the post submission when the 'Post' button is clicked.
                    }}
                    disabled={loading}
                >
                    {loading ? <PulseLoader color="#fff" size={5} /> : "Post"}
                    {/* Display 'Post' or loading spinner based on the loading state. */}
                </button>
            </div>
        </div>
    );
}
