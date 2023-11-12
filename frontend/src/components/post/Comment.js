import Moment from "react-moment";

export default function Comment({ comment }) {
    return (
        <div className="comment">
            {/* Display the user's profile picture associated with the comment */}
            <img src={comment.commentBy.picture} alt="" className="comment_img" />
            <div className="comment_col">
                <div className="comment_wrap">
                    {/* Display the commenter's first name and last name */}
                    <div className="comment_name">
                        {comment.commentBy.first_name} {comment.commentBy.last_name}
                    </div>
                    {/* Display the text content of the comment */}
                    <div className="comment_text">{comment.comment}</div>
                </div>
                {/* Display an image associated with the comment (if available) */}
                {comment.image && <img src={comment.image} alt="" className="comment_image" />}
                <div className="comment_actions">
                    <span className="inactive-icon">Like</span> {/* Option to 'Like' the comment */}
                    <span className="inactive-icon">Reply</span> {/* Option to 'Reply' to the comment */}
                    <span>
                        {/* Display the relative time since the comment was posted */}
                        <Moment fromNow interval={30}>
                            {comment.commentAt}
                        </Moment>
                    </span>
                </div>
            </div>
        </div>
    );
}
