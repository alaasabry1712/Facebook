import { Link } from "react-router-dom";
import Moment from "react-moment";
import { Dots, Public } from "../../svg";
import ReactsPopup from "./ReactsPopup";
import { useEffect, useState } from "react";
import CreateComment from "./CreateComment";
import PostMenu from "./PostMenu";
import { getReacts, reactPost } from "../../functions/post";
import Comment from "./Comment";
import "./style.css";

export default function Post({ post, user, profile }) {
    const [visible, setVisible] = useState(false); // To manage the visibility of the reacts popup
    const [showMenu, setShowMenu] = useState(false); // To manage the visibility of the post menu
    const [reacts, setReacts] = useState(); // To store data related to post reactions
    const [check, setCheck] = useState(); // To store the user's reaction to the post
    const [total, setTotal] = useState(0); // To store the total number of reactions
    const [count, setCount] = useState(1); // To control the number of comments to display
    const [comments, setComments] = useState([]); // To store post comments

    // Effect to fetch post reactions when the 'post' prop changes
    useEffect(() => {
        getPostReacts();
    }, [post]);

    // Effect to update the 'comments' state variable when the 'post' prop changes
    useEffect(() => {
        setComments(post?.comments);
    }, [post]);

    // Function to fetch post reactions and update state variables
    const getPostReacts = async () => {
        const res = await getReacts(post._id, user.token); // Fetch reactions for the specific post using its ID and user token
        setReacts(res.reactions); // Update the 'reacts' state variable with the fetched reactions data
        setCheck(res.userReaction); // Update the 'check' state variable with the user's reaction to the post (if any)
        setTotal(res.total); // Update the 'total' state variable with the total number of reactions for the post
    };

    // Function to handle post reactions
    const reactHandler = async (type) => {
        reactPost(post._id, type, user.token); // Call the 'reactPost' function to submit the user's reaction to the post

        // Check if the user's reaction is the same as the previous reaction (if any)
        if (check === type) {
            setCheck(); // Reset the 'check' state variable (no reaction)
            updateReactionCount(check, -1); // Decrement the count of the previous reaction
        } else {
            updateReactionCount(check, -1); // Decrement the count of the previous reaction
            updateReactionCount(type, 1); // Increment the count of the new reaction
            setCheck(type); // Set the 'check' state variable to the new reaction type
        }
    };

    // Function to update the count of a specific reaction
    const updateReactionCount = (reactionType, change) => {
        let index = reacts.findIndex((x) => x.react === reactionType); // Find the index of the reaction in the 'reacts' array

        // If the reaction exists in the array, update its count
        if (index !== -1) {
            let updatedReacts = [...reacts];
            updatedReacts[index].count += change;
            setReacts(updatedReacts); // Update the 'reacts' array with the new count

            // Update the 'total' count of reactions
            setTotal((prev) => prev + change);
        }
    };

    // Function to load more comments
    const showMore = () => {
        setCount((prev) => prev + 3);
    };

    return (
        <div className="post" style={{ width: `${profile && "100%"}` }}>
            {/* Render the post header, including user information and options menu */}
            <div className="post_header">
                {/* Link to the profile page of the post's user */}
                <Link to={`/profile/${user.username}`} className="post_header_left">
                    <img src={user.picture} alt="" />
                    <div className="header_col">
                        <div className="post_profile_name">
                            {/* Display the user's full name */}
                            {post.user.first_name} {post.user.last_name}
                            <div className="updated_p">
                                {/* Show additional information if the post type is "profilePicture" or "coverPicture" */}
                                {post.type === "profilePicture" &&
                                    `updated ${post.user.gender === "male" ? "his" : "her"} profile picture`}
                                {post.type === "coverPicture" &&
                                    `updated ${post.user.gender === "male" ? "his" : "her"} cover picture`}
                            </div>
                        </div>
                        <div className="post_profile_privacy_date">
                            {/* Display the post's relative creation time and a public icon */}
                            <Moment fromNow interval={30}>
                                {post.createdAt}
                            </Moment>
                            &nbsp;
                            <Public color="#828387" />
                        </div>
                    </div>
                </Link>
                <div className="post_header_right hover1" onClick={() => setShowMenu((prev) => !prev)}>
                    {/* Show three-dot menu icon, allowing post-related options */}
                    <Dots color="#828387" />
                </div>
            </div>

            {/* Conditionally render post content based on the type and properties of the post */}
            {post.background ? (
                // Display a post with a background image
                <div className="post_bg" style={{ backgroundImage: `url(${post.background})` }}>
                    <div className="post_bg_text">{post.text}</div>
                </div>
            ) : post.type === null ? (
                // Display a regular post with text and images if found
                <>
                    <div className="post_text">{post.text}</div>
                    {post.images && post.images.length && (
                        <div
                            className={
                                post.images.length === 1
                                    ? "grid_1"
                                    : post.images.length === 2
                                    ? "grid_2"
                                    : post.images.length === 3
                                    ? "grid_3"
                                    : post.images.length === 4
                                    ? "grid_4"
                                    : post.images.length >= 5 && "grid_5"
                            }
                        >
                            {/* Render images within a grid */}
                            {post.images.slice(0, 5).map((image, i) => (
                                <img src={image.url} key={i} alt="" className={`img-${i}`} />
                            ))}
                            {post.images.length > 5 && <div className="more-pics-shadow">+{post.images.length - 5}</div>}
                        </div>
                    )}
                </>
            ) : post.type === "profilePicture" ? (
                // Display a post related to a profile picture update
                <div className="post_profile_wrap">
                    <div className="post_updated_bg">
                        <img src={post.user.cover} alt="" />
                    </div>
                    <img src={post.images[0].url} alt="" className="post_updated_picture" />
                </div>
            ) : (
                // Display a post related to a cover picture update
                <div className="post_cover_wrap">
                    <img src={post.images[0].url} alt="" />
                </div>
            )}

            <div className="post_info">
                <div className="reacts_count">
                    <div className="reacts_count_imgs">
                        {/* Sort and display the top three reactions with counts */}
                        {reacts &&
                            reacts
                                .sort((a, b) => {
                                    return b.count - a.count;
                                })
                                .slice(0, 3)
                                .map(
                                    (react, i) =>
                                        // Display images for reactions with counts greater than 0
                                        react.count > 0 && <img src={`../../../reacts/${react.react}.svg`} key={i} alt="" />
                                )}
                    </div>
                    <div className="reacts_count_num">{total > 0 && total}</div>
                </div>
                <div className="to_right">
                    <div className="comments_count">{comments.length} comments</div>
                    <div className="share_count inactive-icon">1 share</div>
                </div>
            </div>

            <div className="post_actions">
                <ReactsPopup visible={visible} setVisible={setVisible} reactHandler={reactHandler} />
                <div
                    className="post_action hover1"
                    onMouseOver={() => {
                        // Display the reacts popup on hover
                        setTimeout(() => {
                            setVisible(true);
                        }, 500);
                    }}
                    onMouseLeave={() => {
                        // Hide the reacts popup on mouse leave
                        setTimeout(() => {
                            setVisible(false);
                        }, 500);
                    }}
                    onClick={() => reactHandler(check ? check : "like")}
                >
                    {check ? (
                        <img src={`../../../reacts/${check}.svg`} alt="" className="small_react" style={{ width: "18px" }} />
                    ) : (
                        <i className="like_icon"></i>
                    )}
                    <span
                        style={{
                            color: `
                ${
                    // Set text color based on the selected reaction
                    check === "like"
                        ? "#4267b2"
                        : check === "love"
                        ? "#f63459"
                        : check === "haha"
                        ? "#f7b125"
                        : check === "sad"
                        ? "#f7b125"
                        : check === "wow"
                        ? "#f7b125"
                        : check === "angry"
                        ? "#e4605a"
                        : ""
                }
                `,
                        }}
                    >
                        {check ? check : "Like"}
                    </span>
                </div>
                <div className="post_action hover1">
                    <i className="comment_icon"></i>
                    <span>Comment</span>
                </div>
                <div className="post_action inactive-icon">
                    <i className="share_icon"></i>
                    <span>Share</span>
                </div>
            </div>

            {/* Display comments */}
            <div className="comments_wrap">
                <div className="comments_order"></div>
                {/* Component to create and add comments */}
                <CreateComment user={user} postId={post._id} setComments={setComments} setCount={setCount} />
                {
                    comments && // Check if 'comments' is not null or undefined
                        comments // If 'comments' exists...
                            .sort((a, b) => {
                                // Sort the comments based on their 'commentAt' property in descending order (latest comments first)
                                return new Date(b.commentAt) - new Date(a.commentAt);
                            })
                            .slice(0, count) // Slice the sorted comments to display a limited number based on the 'count' state variable
                            .map((comment, i) => <Comment comment={comment} key={i} />) // Map through the sliced comments and render each one using the 'Comment' component
                }
                {count < comments.length && ( // Check if the number of comments displayed (count) is less than the total number of comments available
                    <div className="view_comments" onClick={() => showMore()}>
                        View more comments
                    </div>
                )}
            </div>

            {showMenu && (
                <PostMenu
                    userId={user.id}
                    postUserId={post.user._id}
                    imagesLength={post?.images?.length}
                    setShowMenu={setShowMenu}
                />
            )}
        </div>
    );
}
