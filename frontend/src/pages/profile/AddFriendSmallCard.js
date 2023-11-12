// Define the AddFriendSmallCard component
export default function AddFriendSmallCard({ item }) {
    return (
        <div className="addfriendCard  inactive-link">
            {/* A div with the 'addfriendCard' class */}
            <div className="addfriend_imgsmall">
                {/* A div with the 'addfriend_imgsmall' class */}
                <img src={item.profile_picture} alt="" className="inactive-icon"/> {/* Display the user's profile picture */}
                <div className="addfriend_info">
                    {/* A div with the 'addfriend_info' class */}
                    <div className="addfriend_name">
                        {/* A div with the 'addfriend_name' class */}
                        {/* Display the user's profile name, and if it's longer than 11 characters, truncate it */}
                        {item.profile_name.length > 11 ? `${item.profile_name.substring(0, 11)}...` : item.profile_name}
                    </div>
                    <div className="light_blue_btn  inactive-link">
                        {/* A div with the 'light_blue_btn' class */}
                        <img src="../../../icons/addFriend.png" alt="" className="filter_blue inactive-icon" />
                        {/* Display an icon (add friend) */}
                        Add Friend {/* Text for adding a friend */}
                    </div>
                </div>
            </div>
        </div>
    );
}
