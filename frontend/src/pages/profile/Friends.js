import { Link } from "react-router-dom";

//  Renders a component to display a user's friends on their profile page.
export default function Friends({ friends }) {
    return (
        <div className="profile_card">
            <div className="profile_card_header">
                Friends
                <div className="profile_header_link inactive-icon">See all friends</div>
            </div>
            {friends && (
                <div className="profile_card_count">
                    {/* Display the count of friends. It varies based on the number of friends. */}
                    {friends.length === 0 ? "" : friends.length === 1 ? "1 Photo" : `${friends.length} photos`}
                </div>
            )}
            <div className="profile_card_grid">
                {friends &&
                    friends.slice(0, 9).map((friend, i) => (
                        // Render a grid of friends' profile photo cards. Limited to 9 friends.
                        <Link to={`/profile/${friend.username}`} key={i} className="profile_photo_card">
                            <img src={friend.picture} alt="" />
                            <span>
                                {friend.first_name} {friend.last_name}
                            </span>
                        </Link>
                    ))}
            </div>
        </div>
    );
}
