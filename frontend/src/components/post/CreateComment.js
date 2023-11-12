import { useEffect, useRef, useState } from "react";
import Picker from "emoji-picker-react";
import { comment } from "../../functions/post";
import { uploadImages } from "../../functions/uploadImages";
import dataURItoBlob from "../../helpers/dataURItoBlob";
import { ClipLoader } from "react-spinners";

export default function CreateComment({ user, postId, setComments, setCount }) {
    // State variables to manage comment input and image
    const [picker, setPicker] = useState(false); // Emoji picker visibility
    const [text, setText] = useState(""); // Comment text input
    const [error, setError] = useState(""); // Error message for image uploads
    const [loading, setLoading] = useState(false); // Used to control the visibility of a loading spinner during comment submission
    const [commentImage, setCommentImage] = useState(""); // Selected comment image
    const [cursorPosition, setCursorPosition] = useState(); // Cursor position for text input
    const textRef = useRef(null); // Reference to the comment text input element
    const imgInput = useRef(null); // Reference to the image input element

    useEffect(() => {
        // Update the cursor position in the comment text input
        textRef.current.selectionEnd = cursorPosition;
    }, [cursorPosition]);

    const handleEmoji = (e, { emoji }) => {
        // Handle emoji selection
        const ref = textRef.current;
        ref.focus();
        const start = text.substring(0, ref.selectionStart);
        const end = text.substring(ref.selectionStart);
        const newText = start + emoji + end;
        setText(newText); // Add the selected emoji to the comment text
        setCursorPosition(start.length + emoji.length); // Update the cursor position
    };

    const handleImage = (e) => {
        // Handle image selection
        let file = e.target.files[0];

        // Check if the selected file format is supported (JPEG, PNG, WebP, or GIF)
        if (
            file.type !== "image/jpeg" &&
            file.type !== "image/png" &&
            file.type !== "image/webp" &&
            file.type !== "image/gif"
        ) {
            setError(`${file.name} format is not supported.`);
            return;
        }

        // Check if the selected file size is within the allowed limit (max 5MB)
        if (file.size > 1024 * 1024 * 5) {
            setError(`${file.name} is too large, with a maximum size of 5MB allowed.`);
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);

        // Once the file is read, set the selected image for the comment
        reader.onload = (event) => {
            setCommentImage(event.target.result);
        };
    };

    // This function is responsible for handling the submission of comments.
    const handleComment = async (e) => {
        if (e.key === "Enter") {
            if (commentImage !== "") {
                // If an image is selected for the comment
                setLoading(true); // Activate the loading spinner to indicate the comment is being processed
                // Convert the selected image data URI to a Blob
                const img = dataURItoBlob(commentImage);
                // Define the path for the image upload, typically based on user and post information
                const path = `${user.username}/post_images/${postId}`;
                // Create a FormData object for image upload
                let formData = new FormData();
                formData.append("path", path);
                formData.append("file", img);
                // Upload the image and receive its URL
                const imgComment = await uploadImages(formData, path, user.token);
                // Add the comment with the image URL to the post
                const comments = await comment(postId, text, imgComment[0].url, user.token);
                // Update the comments state and count
                setComments(comments);
                setCount((prev) => ++prev);
                setLoading(false); // Deactivate the loading spinner
                setText(""); // Clear the comment text input
                setCommentImage(""); // Clear the selected comment image
            } else {
                // If no image is selected
                setLoading(true); // Activate the loading spinner
                const comments = await comment(postId, text, "", user.token); // Add a comment without an image to the post
                // Update the comments state and count
                setComments(comments);
                setCount((prev) => ++prev);
                setLoading(false); // Deactivate the loading spinner
                setText(""); // Clear the comment text input
                setCommentImage(""); // Clear the selected comment image
            }
        }
    };

    return (
        <div className="create_comment_wrap">
            <div className="create_comment">
                <img src={user?.picture} alt="" /> {/* Display the user's profile picture */}
                <div className="comment_input_wrap">
                    {picker && (
                        <div className="comment_emoji_picker">
                            <Picker onEmojiClick={handleEmoji} /> {/* Emoji picker for adding emojis to comments */}
                        </div>
                    )}
                    <input
                        type="file"
                        hidden
                        ref={imgInput}
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={handleImage}
                    />
                    {error && (
                        <div className="postError comment_error">
                            <div className="postError_error">{error}</div>{" "}
                            {/* Display an error message if there is an issue with the comment */}
                            <button className="blue_btn" onClick={() => setError("")}>
                                Try again
                            </button>
                            {/* Button to retry comment submission */}
                        </div>
                    )}
                    {/* Text input for entering comments */}
                    <input
                        type="text"
                        ref={textRef}
                        value={text}
                        placeholder="Write a comment..."
                        onChange={(e) => setText(e.target.value)}
                        onKeyUp={handleComment}
                    />
                    <div className="comment_circle" style={{ marginTop: "5px" }}>
                        <ClipLoader size={20} color="#1876f2" loading={loading} />
                    </div>
                    <div
                        className="comment_circle_icon hover2"
                        onClick={() => {
                            setPicker((prev) => !prev);
                        }}
                    >
                        <i className="emoji_icon"></i> {/* Button to toggle emoji picker */}
                    </div>
                    <div className="comment_circle_icon hover2" onClick={() => imgInput.current.click()}>
                        <i className="camera_icon"></i> {/* Button to trigger image selection */}
                    </div>
                    <div className="comment_circle_icon inactive-icon">
                        <i className="gif_icon"></i> {/* A placeholder for a GIF icon */}
                    </div>
                    <div className="comment_circle_icon inactive-icon">
                        <i className="sticker_icon"></i> {/* A placeholder for a sticker icon */}
                    </div>
                </div>
            </div>

            {commentImage && (
                <div className="comment_img_preview">
                    <img src={commentImage} alt="" /> {/* Display the selected comment image */}
                    <div className="small_white_circle" onClick={() => setCommentImage("")}>
                        <i className="exit_icon"></i> {/* Button to remove the displayed comment image */}
                    </div>
                </div>
            )}
        </div>
    );
}
