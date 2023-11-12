import { useRef } from "react";
import { useSelector } from "react-redux";
import useClickOutside from "../../helpers/clickOutside";

export default function OldCovers({ photos, setCoverPicture, setShow }) {
    const { user } = useSelector((state) => ({ ...state }));
    const Ref = useRef(null);
    useClickOutside(Ref, () => setShow(false));

    return (
        <div className="blur">
            {/* The outer container with a blur effect to overlay the background. */}
            <div className="postBox selectCoverBox" ref={Ref}>
                {/* The main "selectCoverBox" component for selecting a cover photo. */}
                <div className="box_header">
                    {/* The header section of the selectCoverBox. */}
                    <div
                        className="small_circle"
                        onClick={() => {
                            setShow(false);
                        }}
                    >
                        {/* Close button represented by a small circle with an exit icon. */}
                        <i className="exit_icon"></i>
                    </div>
                    <span>Select photo</span> {/* Display "Select photo" title. */}
                </div>
                <div className="selectCoverBox_links">
                    {/* Links for selecting cover photos from different sources. */}
                    <div className="selectCoverBox_link">Recent Photos</div>
                    {/* Link to select from recent photos. */}
                    <div className="selectCoverBox_link">Photo Albums</div>
                    {/* Link to select from photo albums. */}
                </div>
                <div className="old_pictures_wrap scrollbar">
                    {/* Container for displaying old cover pictures with a scrollbar. */}
                    <div className="old_pictures">
                        {/* Container for old cover pictures. */}
                        {photos &&
                            photos
                                .filter((img) => img.folder === `${user.username}/cover_pictures`)
                                .map((photo) => (
                                    <img
                                        src={photo.secure_url}
                                        key={photo.public_id}
                                        alt=""
                                        onClick={() => {
                                            setCoverPicture(photo.secure_url);
                                            setShow(false);
                                        }}
                                    />
                                ))}
                        {/* Map and display old cover photos filtered by folder. */}
                    </div>
                    <div className="old_pictures">
                        {/* Container for old cover pictures from other folders. */}
                        {photos &&
                            photos
                                .filter((img) => img.folder !== `${user.username}/post_images`)
                                .map((photo) => (
                                    <img
                                        src={photo.secure_url}
                                        key={photo.public_id}
                                        alt=""
                                        onClick={() => {
                                            setCoverPicture(photo.secure_url);
                                            setShow(false);
                                        }}
                                    />
                                ))}
                        {/* Map and display old cover photos from folders other than post_images. */}
                    </div>
                </div>
            </div>
        </div>
    );
}
