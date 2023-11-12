import { useCallback, useRef, useState } from "react"; // Import necessary React hooks and dependencies
import Cropper from "react-easy-crop"; // Import the Cropper component for image cropping
import { useDispatch, useSelector } from "react-redux"; // Import Redux hooks for accessing the store
import { createPost } from "../../functions/post"; // Import the function for creating a new post
import { uploadImages } from "../../functions/uploadImages"; // Import the function for uploading images
import { updateProfilePicture } from "../../functions/user"; // Import the function for updating the user's profile picture
import getCroppedImg from "../../helpers/getCroppedImg"; // Import a helper function for getting the cropped image
import PulseLoader from "react-spinners/PulseLoader"; // Import a loading spinner component
import Cookies from "js-cookie"; // Import a library for handling cookies

export default function UpdateProfilePicture({ setImage, image, setError, setShow, pRef }) {
    const dispatch = useDispatch(); // Access the dispatch function from the Redux store
    const [description, setDescription] = useState(""); // State for the description of the image
    const [crop, setCrop] = useState({ x: 0, y: 0 }); // State for cropping coordinates
    const [zoom, setZoom] = useState(1); // State for the zoom level
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null); // State to store cropped area information
    const slider = useRef(null); // Reference to the zoom slider element
    const { user } = useSelector((state) => ({ ...state })); // Access user data from the Redux store
    const [loading, setLoading] = useState(false); // State to track loading status

    // The `onCropComplete` function is a callback that's called when a crop action is completed.
    // It receives `croppedArea` and `croppedAreaPixels` as arguments, but in this code, it only updates `croppedAreaPixels` in the state.
    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        // This line updates the cropped area pixel data.
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    // The `zoomIn` and `zoomOut` functions are used to adjust the zoom level of the image.
    const zoomIn = () => {
        // Increase the zoom level by one step.
        slider.current.stepUp();
        // Update the zoom state based on the new slider value.
        setZoom(slider.current.value);
    };

    const zoomOut = () => {
        // Decrease the zoom level by one step.
        slider.current.stepDown();
        // Update the zoom state based on the new slider value.
        setZoom(slider.current.value);
    };

    // The `getCroppedImage` function is used to retrieve the cropped image.
    // It takes a `show` parameter, which determines whether to display or return the cropped image.
    const getCroppedImage = useCallback(
        async (show) => {
            try {
                // Get the cropped image using the `getCroppedImg` helper function.
                const img = await getCroppedImg(image, croppedAreaPixels);

                if (show) {
                    // If `show` is true, it sets the zoom and crop values to their default states and updates the image in the state.
                    setZoom(1); // Reset zoom level
                    setCrop({ x: 0, y: 0 }); // Reset crop position
                    setImage(img); // Update the image in the state
                } else {
                    return img; // Return the cropped image.
                }
            } catch (error) {
                console.log(error); // Log any errors that occur during the process.
            }
        },
        [croppedAreaPixels]
    );

    // Function to update profile picture
    const setProfilePicture = async () => {
        try {
            setLoading(true);
            // Get the cropped image
            let img = await getCroppedImage();
            // Convert the image to blob format
            let blob = await fetch(img).then((b) => b.blob());
            // Define the storage path for the image
            const path = `${user.username}/profile_pictures`;
            let formData = new FormData();
            // Append the image file and path to a form data object
            formData.append("file", blob);
            formData.append("path", path);
            // Upload the image to cloud storage
            const res = await uploadImages(formData, path, user.token);
            // Update the profile picture URL in the user's data
            const updated_picture = await updateProfilePicture(res[0].url, user.token);

            if (updated_picture === "ok") {
                // Create a new post with the updated profile picture
                const new_post = await createPost("profilePicture", null, description, res, user.id, user.token);

                if (new_post.status === "ok") {
                    setLoading(false);
                    // Clear image state and set the profile picture in the UI
                    setImage("");
                    pRef.current.style.backgroundImage = `url(${res[0].url})`;
                    // Update the user data in Redux and store it in a cookie
                    Cookies.set(
                        "user",
                        JSON.stringify({
                            ...user,
                            picture: res[0].url,
                        })
                    );
                    dispatch({
                        type: "UPDATEPICTURE",
                        payload: res[0].url,
                    });
                    // Close the modal
                    setShow(false);
                } else {
                    setLoading(false);
                    setError(new_post);
                }
            } else {
                setLoading(false);
                setError(updated_picture);
            }
        } catch (error) {
            setLoading(false);
            setError(error.response.data.message);
        }
    };

    return (
        <div className="postBox update_img">
            <div className="box_header">
                {/* Small circular element, acts as a close button */}
                <div className="small_circle" onClick={() => setImage("")}>
                    {/* Icon representing the close action */}
                    <i className="exit_icon"></i>
                </div>
                {/* Text title indicating the purpose of the component */}
                <span>Update profile picture</span>
            </div>
            {/* Container for the image description input field */}
            <div className="update_image_desc">
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="textarea_blue details_input"
                ></textarea>
            </div>
            <div className="update_center">
                {/* Container for the image cropping and zooming section */}
                <div className="crooper">
                    {/* Image cropper using the 'Cropper' component */}
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={1 / 1}
                        cropShape="round"
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                        showGrid={false}
                    />
                    {/* The Cropper component:
                        - 'image': The source image for cropping
                        - 'crop': Current crop settings
                        - 'zoom': Current zoom level
                        - 'aspect': Aspect ratio for cropping (square in this case)
                        - 'cropShape': Round shape for cropping
                        - 'onCropChange': Function to update the crop settings
                        - 'onCropComplete': Function to handle crop completion
                        - 'onZoomChange': Function to update the zoom level
                        - 'showGrid': Whether to display the grid on the cropper */}
                </div>
                <div className="slider">
                    {/* Container for the zoom slider */}
                    <div className="slider_circle hover1" onClick={() => zoomOut()}>
                        {/* Button to zoom out */}
                        <i className="minus_icon"></i>
                    </div>
                    <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.2}
                        ref={slider}
                        value={zoom}
                        onChange={(e) => setZoom(e.target.value)}
                    />
                    {/* Input range for adjusting zoom level with attributes:
                        - 'type': Specifies the input type as 'range'
                        - 'min': Minimum zoom value
                        - 'max': Maximum zoom value
                        - 'step': Step size for zoom adjustments
                        - 'ref': Reference to the slider element
                        - 'value': Current zoom level
                        - 'onChange': Function to handle zoom changes */}
                    <div className="slider_circle hover1" onClick={() => zoomIn()}>
                        {/* Button to zoom in */}
                        <i className="plus_icon"></i>
                    </div>
                </div>
            </div>
            {/* Container for buttons to crop and make temporary */}
            <div className="flex_up">
                {/* Button to apply cropping */}
                <div className="gray_btn" onClick={() => getCroppedImage("show")}>
                    <i className="crop_icon"></i>Crop photo
                </div>
                <div className="gray_btn">
                    <i className="temp_icon"></i>Make Temporary
                </div>
            </div>
            <div className="flex_p_t">
                <i className="public_icon"></i>
                Your profile picture is public
            </div>
            {/* Container for Cancel and Save buttons */}
            <div className="update_submit_wrap">
                {/* Button to cancel profile picture update */}
                <div className="blue_link" onClick={() => setImage("")}>
                    Cancel
                </div>
                {/* Button to save the updated profile picture */}
                <button className="blue_btn" disabled={loading} onClick={() => setProfilePicture()}>
                    {loading ? <PulseLoader color="#fff" size={5} /> : "Save"}
                </button>
            </div>
            {/*  'update_submit_wrap' contains Cancel and Save buttons, where 'loading' state is used to disable the button
            while processing the update. A loading spinner is displayed when saving the image. */}
        </div>
    );
}
