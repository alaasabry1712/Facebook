import { useCallback, useEffect, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import useClickOutside from "../../helpers/clickOutside";
import getCroppedImg from "../../helpers/getCroppedImg";
import { uploadImages } from "../../functions/uploadImages";
import { useSelector } from "react-redux";
import { updateCover } from "../../functions/user";
import { createPost } from "../../functions/post";
import PulseLoader from "react-spinners/PulseLoader";
import OldCovers from "./OldCovers";

export default function Cover({ cover, visitor, photos }) {
    const [showCoverMenu, setShowCoverMenu] = useState(false); // State to control the cover menu
    const [coverPicture, setCoverPicture] = useState(""); // State to store the selected cover picture
    const [loading, setLoading] = useState(false); // State to indicate loading status
    const [show, setShow] = useState(false); // State to control visibility
    const { user } = useSelector((state) => ({ ...state })); // Get the user data
    const menuRef = useRef(null); // Ref for the cover menu
    const refInput = useRef(null); // Ref for the input element
    const cRef = useRef(null); // Ref for cover picture
    useClickOutside(menuRef, () => setShowCoverMenu(false)); // Hook to handle clicks outside the cover menu

    const [error, setError] = useState(""); // State to handle errors

    // Function to handle image selection
    const handleImage = (e) => {
        let file = e.target.files[0];

        // Check if the selected file is of a supported format (jpeg, png, webp, gif)
        if (
            file.type !== "image/jpeg" &&
            file.type !== "image/png" &&
            file.type !== "image/webp" &&
            file.type !== "image/gif"
        ) {
            setError(`${file.name} format is not supported.`);
            setShowCoverMenu(false);
            return;
        } else if (file.size > 1024 * 1024 * 5) {
            // Check if the file size is too large (max 5mb allowed)
            setError(`${file.name} is too large, max 5mb allowed.`);
            setShowCoverMenu(false);
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);

        // When the file is read, set it as the cover picture
        reader.onload = (event) => {
            setCoverPicture(event.target.result);
        };
    };

    const [crop, setCrop] = useState({ x: 0, y: 0 }); // State to control cropping
    const [zoom, setZoom] = useState(1); // State to control zoom level
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null); // State to store cropped area pixels

    // Callback function to handle crop completion
    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    // Function to get the cropped image
    const getCroppedImage = useCallback(
        async (show) => {
            try {
                const img = await getCroppedImg(coverPicture, croppedAreaPixels);

                if (show) {
                    setZoom(1);
                    setCrop({ x: 0, y: 0 });
                    setCoverPicture(img);
                } else {
                    return img;
                }
            } catch (error) {
                console.log(error);
            }
        },
        [croppedAreaPixels]
    );

    const coverRef = useRef(null); // Ref for the cover element
    const [width, setWidth] = useState();

    useEffect(() => {
        setWidth(coverRef.current.clientWidth);
    }, [window.innerWidth]);

    // Function to update the cover picture
    // Function to update the user's cover picture with a cropped image
    const updateCoverPicture = async () => {
        try {
            // Set loading state to indicate an ongoing operation
            setLoading(true);

            // Get the cropped image
            let img = await getCroppedImage();

            // Convert the cropped image to a Blob object
            let blob = await fetch(img).then((b) => b.blob());

            // Construct the path for storing the image
            const path = `${user.username}/cover_pictures`;

            // Create a FormData object and append the image data and path
            let formData = new FormData();
            formData.append("file", blob);
            formData.append("path", path);

            // Upload the image using the 'uploadImages' function with user's token
            const res = await uploadImages(formData, path, user.token);

            // Attempt to update the user's cover picture with the new URL
            const updated_picture = await updateCover(res[0].url, user.token);

            // Check if updating the cover picture was successful
            if (updated_picture === "ok") {
                // Create a new post to notify followers or log the cover picture change
                const new_post = await createPost("coverPicture", null, null, res, user.id, user.token);

                // Check if creating the post was successful
                if (new_post.status === "ok") {
                    // Set loading state to 'false' to indicate completion
                    setLoading(false);

                    // Clear the cover picture
                    setCoverPicture("");

                    // Update the 'src' of the cover picture element with the new URL
                    cRef.current.src = res[0].url;
                } else {
                    // Set loading state to 'false'
                    setLoading(false);

                    // Set the error state with the message from 'createPost' if it fails
                    setError(new_post);
                }
            } else {
                // Set loading state to 'false'
                setLoading(false);

                // Set the error state with the message from 'updateCover' if it fails
                setError(updated_picture);
            }
        } catch (error) {
            // Handle any exceptions or errors during the process
            setLoading(false);

            // Set the error state with the error message received from the server response
            setError(error.response.data.message);
        }
    };

    return (
        <div className="profile_cover" ref={coverRef}>
            {coverPicture && (
                // Render this section only if 'coverPicture' is truthy
                <div className="save_changes_cover">
                    <div className="save_changes_left">
                        {/* Left side of the 'Save Changes' section */}
                        <i className="public_icon"></i>
                        {/* Display a public icon */}
                        Your cover photo is public
                        {/* Text indicating that the cover photo is public */}
                    </div>
                    <div className="save_changes_right">
                        {/* Right side of the 'Save Changes' section */}
                        <button className="blue_btn opacity_btn" onClick={() => setCoverPicture("")}>
                            {/* Cancel button */}
                            Cancel
                        </button>
                        <button className="blue_btn " onClick={() => updateCoverPicture()}>
                            {/* 'Save changes' button */}
                            {loading ? <PulseLoader color="#fff" size={5} /> : "Save changes"}
                            {/* If 'loading' is true, show a loading spinner; otherwise, display "Save changes" */}
                        </button>
                    </div>
                </div>
            )}

            <input
                type="file"
                ref={refInput}
                hidden
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImage}
            />
            {error && (
                // Conditionally render this section when an 'error' is present
                <div className="postError comment_error cover_error">
                    {/* Display an error message with specific styling */}
                    <div className="postError_error">{error}</div>
                    <button className="blue_btn" onClick={() => setError("")}>
                        {/* Display a button for the user to dismiss the error message */}
                        Try again
                    </button>
                </div>
            )}

            {coverPicture && (
                // Conditionally render the following when 'coverPicture' is present
                <div className="cover_crooper">
                    {/* Display a cropper component for cropping the cover image */}
                    <Cropper
                        image={coverPicture}
                        crop={crop}
                        zoom={zoom}
                        aspect={width / 350}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                        showGrid={true}
                        objectFit="horizontal-cover"
                    />
                </div>
            )}

            {cover && !coverPicture && (
                // Conditionally render an image when 'cover' is present and 'coverPicture' is not set
                <img src={cover} className="cover" alt="" ref={cRef} />
            )}

            {!visitor && (
                // Conditionally render a set of elements if the user is not a visitor
                <div className="udpate_cover_wrapper">
                    <div className="open_cover_update" onClick={() => setShowCoverMenu((prev) => !prev)}>
                        {/* Icon and text to open cover photo options */}
                        <i className="camera_filled_icon"></i>
                        Add Cover Photo
                    </div>
                    {showCoverMenu && (
                        // Conditionally render a menu if 'showCoverMenu' is true
                        <div className="open_cover_menu" ref={menuRef}>
                            <div className="open_cover_menu_item hover1" onClick={() => setShow(true)}>
                                {/* Option to select a photo */}
                                <i className="photo_icon"></i>
                                Select Photo
                            </div>
                            <div className="open_cover_menu_item hover1" onClick={() => refInput.current.click()}>
                                {/* Option to upload a photo */}
                                <i className="upload_icon"></i>
                                Upload Photo
                            </div>
                        </div>
                    )}
                </div>
            )}

            {show && (
                // Conditionally render the 'OldCovers' component when 'show' is true
                <OldCovers photos={photos} setCoverPicture={setCoverPicture} setShow={setShow} />
            )}
        </div>
    );
}
