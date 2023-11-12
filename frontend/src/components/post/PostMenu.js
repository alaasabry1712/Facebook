import { useRef, useState } from "react";
import MenuItem from "./MenuItem";
import useOnClickOutside from "../../helpers/clickOutside";
import { deletePost, savePost } from "../../functions/post";
import { saveAs } from "file-saver";

export default function PostMenu({
    postUserId,
    userId,
    imagesLength,
    setShowMenu,
    token,
    postId,
    checkSaved,
    setCheckSaved,
    images,
    postRef,
}) {
    // Define a state variable 'test' which is initially true if 'postUserId' is equal to 'userId'.
    const [test, setTest] = useState(postUserId === userId ? true : false);

    // Create a reference to the menu element and use a custom hook to handle clicks outside the menu.
    const menu = useRef(null);
    useOnClickOutside(menu, () => setShowMenu(false));

    // Handles saving or unsaving a post and updates the saved status in the component's state.
    const saveHandler = async () => {
        // 1. Attempt to save the post using the savePost function.
        //    The function communicates with the server to save the post.
        savePost(postId, token);

        // 2. Check the current saved status of the post, indicated by the checkSaved state variable.
        if (checkSaved) {
            // 3. If the post is currently saved:
            //    - Set checkSaved to false, indicating that the post is now unsaved.
            setCheckSaved(false);
        } else {
            // 4. If the post is not currently saved:
            //    - Set checkSaved to true, indicating that the post is now saved.
            setCheckSaved(true);
        }

        // The saveHandler function essentially toggles the saved status of the post,
        // allowing the user to save or unsave the post, and updates the component's state accordingly.
    };

    /* Handles downloading images associated with a post.
    This function triggers the download of one or more images, if available, by utilizing the saveAs function.*/
    const downloadImages = async () => {
        // 1. Iterate through each image URL in the 'images' array.
        images.map((img) => {
            // 2. For each image URL, initiate the download using the 'saveAs' function.
            //    - 'img.url' represents the URL of the image to be downloaded.
            //    - "image.jpg" is the desired filename for the downloaded image.
            saveAs(img.url, "image.jpg");
        });
    };

    /* Handles the deletion of a post.
    This function sends a request to the server to delete the post associated with 'postId'.
    If the deletion is successful, it removes the post element from the user interface.*/
    const deleteHandler = async () => {
        // 1. Send a request to the server to delete the post using the 'deletePost' function.
        const res = await deletePost(postId, token);

        // 2. Check if the deletion request was successful by inspecting the 'res' object.
        //    - 'res.status' is expected to be "ok" if the deletion was successful.
        if (res.status === "ok") {
            // 3. If the post deletion is successful:
            //    - Remove the post element from the user interface.
            //    - This typically involves removing the post element from the DOM.
            postRef.current.remove();
        }
    };

    return (
        // Render an unordered list with the class 'post_menu' and attach the 'menu' reference to it.
        <ul className="post_menu" ref={menu}>
            {test && <MenuItem icon="pin_icon" title="Pin Post" />}

            {/* Save Post */}
            <div onClick={() => saveHandler()}>
                {checkSaved ? (
                    <MenuItem icon="save_icon" title="Unsave Post" subtitle="Remove this from your saved items." />
                ) : (
                    <MenuItem icon="save_icon" title="Save Post" subtitle="Add this to your saved items." />
                )}
            </div>
            <div className="line"></div>

            {test && <MenuItem icon="edit_icon" title="Edit Post" />}

            {!test && <MenuItem icon="turnOnNotification_icon" title="Turn on notifications for this post" />}

            {/* Download Images */}
            {imagesLength && (
                <div onClick={() => downloadImages()}>
                    <MenuItem icon="download_icon" title="Download" />
                </div>
            )}

            {imagesLength && <MenuItem icon="fullscreen_icon" title="Enter Fullscreen" />}

            {/* Edit Audience (Only for Post Owner) */}
            {test && <MenuItem img="../../../icons/lock.png" title="Edit audience" />}

            {test && <MenuItem icon="turnOffNotifications_icon" title="Turn off notifications for this post" />}

            {test && <MenuItem icon="delete_icon" title="Turn off translations" />}

            {test && <MenuItem icon="date_icon" title="Edit Date" />}

            {test && <MenuItem icon="refresh_icon" title="Refresh share attachment" />}

            {test && <MenuItem icon="archive_icon" title="Move to archive" />}

            {/* Move to Trash (Only for Post Owner) */}
            {test && (
                <div onClick={() => deleteHandler()}>
                    <MenuItem
                        icon="trash_icon"
                        title="Move to trash"
                        subtitle="items in your trash are deleted after 30 days"
                    />
                </div>
            )}

            {/* Report Post (For Non-Post Owners) */}
            {!test && <div className="line"></div>}
            {!test && (
                <MenuItem img="../../../icons/report.png" title="Report post" subtitle="I'm concerned about this post" />
            )}
        </ul>
    );
}
