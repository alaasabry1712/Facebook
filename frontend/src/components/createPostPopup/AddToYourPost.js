import { Dots, Feeling, Photo } from "../../svg"; // Importing SVG icons for use in the component.

export default function AddToYourPost({ setShowPrev }) {
    return (
        <div className="addtoyourpost">
            <div className="addto_text">Add to your post</div>
            {/* A button to add photos to the post. */}
            <div
                className="post_header_right hover1"
                onClick={() => {
                    setShowPrev(true);
                }}
            >
                <Photo color="#45bd62" />
            </div>
            <div className="post_header_right inactive-icon">
                <i className="tag_icon"></i>
            </div>
            <div className="post_header_right inactive-icon">
                <Feeling color="#f7b928" />
            </div>
            <div className="post_header_right inactive-icon">
                <i className="maps_icon"></i>
            </div>
            <div className="post_header_right inactive-icon">
                <i className="microphone_icon"></i>
            </div>
            <div className="post_header_right inactive-icon">
                <Dots color="#65676b" />
            </div>
        </div>
    );
}
