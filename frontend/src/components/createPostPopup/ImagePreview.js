import { useRef } from "react";
import EmojiPickerBackgrounds from "./EmojiPickerBackgrounds";

export default function ImagePreview({ text, user, setText, images, setImages, setShowPrev, setError, setBackground }) {
    const imageInputRef = useRef(null); // Creating a reference to the image input element.

    const handleImages = (e) => {
        // Function to handle selected images.
        let files = Array.from(e.target.files); // Convert selected files into an array.
        files.forEach((img) => {
            // Check if the image format is supported (JPEG, PNG, WebP, or GIF).
            if (
                img.type !== "image/jpeg" &&
                img.type !== "image/png" &&
                img.type !== "image/webp" &&
                img.type !== "image/gif"
            ) {
                setError(`${img.name} format is unsupported! Only JPEG, PNG, WebP, and GIF are allowed.`);
                files = files.filter((item) => item.name !== img.name); // Remove unsupported images from the list.
                return;
            }
            // Check if the image size is within the allowed limit (5 MB).
            else if (img.size > 1024 * 1024 * 5) {
                setError(`${img.name} size is too large. Maximum size allowed is 5 MB.`);
                files = files.filter((item) => item.name !== img.name); // Remove oversized images from the list.
                return;
            } else {
                // Read the image as a Data URL and add it to the 'images' state
                // A Data URL is a way to represent file data as a base64-encoded string, allowing it to be used as the source of an image element in HTML.
                const reader = new FileReader();
                reader.readAsDataURL(img); // Read the image as a data URL.
                // Set up an event handler for when the reading is completed
                reader.onload = (readerEvent) => {
                    setImages((images) => [...images, readerEvent.target.result]); // Add the image to the list of selected images.
                };
            }
        });
    };

    return (
        <div className="overflow_a scrollbar">
            {/* Include the EmojiPickerBackgrounds component for text input and emoji selection. */}
            <EmojiPickerBackgrounds text={text} user={user} setText={setText} type2 />
            <div className="add_pics_wrap">
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    hidden
                    ref={imageInputRef}
                    onChange={handleImages}
                />
                {images && images.length ? ( // Check if there are selected images.
                    <div className="add_pics_inside1 p0">
                        <div className="preview_actions">
                            <button className="hover1">
                                <i className="edit_icon"></i>
                                Edit
                            </button>
                            <button
                                className="hover1"
                                onClick={() => {
                                    imageInputRef.current.click(); // Trigger the image input when "Add Photos/Videos" is clicked.
                                }}
                            >
                                <i className="addPhoto_icon"></i>
                                Add Photos/Videos
                            </button>
                        </div>
                        <div
                            className="small_white_circle"
                            onClick={() => {
                                setImages([]); // Clear the selected images.
                            }}
                        >
                            <i className="exit_icon"></i>
                        </div>
                        <div
                            className={
                                images.length === 1
                                    ? "preview1"
                                    : images.length === 2
                                    ? "preview2"
                                    : images.length === 3
                                    ? "preview3"
                                    : images.length === 4
                                    ? "preview4 "
                                    : images.length === 5
                                    ? "preview5"
                                    : images.length % 2 === 0
                                    ? "preview6"
                                    : "preview6 singular_grid"
                            }
                        >
                            {images.map((img, i) => (
                                <img src={img} key={i} alt="" /> // Display selected images.
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="add_pics_inside1">
                        <div
                            className="small_white_circle"
                            onClick={() => {
                                setBackground(false);
                                setShowPrev(false);
                            }}
                        >
                            <i className="exit_icon"></i>
                        </div>
                        <div
                            className="add_col"
                            onClick={() => {
                                imageInputRef.current.click(); // Trigger the image input when "Add Photos/Videos" is clicked.
                            }}
                        >
                            <div className="add_circle">
                                <i className="addPhoto_icon"></i>
                            </div>
                            <span>Add Photos/Videos</span>
                            <span>or drag and drop</span>
                        </div>
                    </div>
                )}
                <div className="add_pics_inside2">
                    <div className="add_circle">
                        <i className="phone_icon"></i>
                    </div>
                    <div className="mobile_text">Add photos from your mobile device.</div>
                    <span className="addphone_btn">Add</span>
                </div>
            </div>
        </div>
    );
}
