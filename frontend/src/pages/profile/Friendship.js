import { useEffect, useRef, useState } from "react";
import useClickOutside from "../../helpers/clickOutside";
import { useSelector } from "react-redux";
import { acceptRequest, addFriend, cancelRequest, deleteRequest, follow, unfollow, unfriend } from "../../functions/user";

/**
 * Displays friendship options and actions for the user's relationship with another user.
 * @param {object} friendshipp - An object representing the current friendship status.
 * @param {string} profileid - The unique identifier of the user's profile.
 */
export default function Friendship({ friendshipp, profileid }) {
    const [friendship, setFriendship] = useState(friendshipp); // Initialize the friendship status state and update it when the 'friendshipp' prop changes

    // Update the friendship status when friendshipp changes
    useEffect(() => {
        setFriendship(friendshipp);
    }, [friendshipp]);

    // States to control the visibility of different menus
    const [friendsMenu, setFriendsMenu] = useState(false);
    const [respondMenu, setRespondMenu] = useState(false);

    // Refs for detecting clicks outside of menus
    const menu = useRef(null);
    const menu1 = useRef(null);

    // Handle clicks outside of menus
    useClickOutside(menu, () => setFriendsMenu(false));
    useClickOutside(menu1, () => setRespondMenu(false));

    // Retrieve user information from the Redux store
    const { user } = useSelector((state) => ({ ...state }));

    // Handle adding a friend by updating friendship status and making an API call
    const addFriendHandler = async () => {
        // Update the friendship status to indicate a friend request has been sent and user is following
        setFriendship({ ...friendship, requestSent: true, following: true });

        // Call the 'addFriend' function to send a friend request
        await addFriend(profileid, user.token);
    };

    // Handle canceling a friend request by updating friendship status and making an API call
    const cancelRequestHandler = async () => {
        // Update the friendship status to indicate the friend request has been canceled and user is no longer following
        setFriendship({ ...friendship, requestSent: false, following: false });

        // Call the 'cancelRequest' function to cancel the friend request
        await cancelRequest(profileid, user.token);
    };

    // Handle following a user by updating friendship status and making an API call
    const followHandler = async () => {
        // Update the friendship status to indicate that the user is following the profile
        setFriendship({ ...friendship, following: true });

        // Call the 'follow' function to send a follow request to the profile
        await follow(profileid, user.token);
    };

    // Handle unfollowing a user by updating friendship status and making an API call
    const unfollowHandler = async () => {
        // Update the friendship status to indicate that the user is unfollowing the profile
        setFriendship({ ...friendship, following: false });

        // Call the 'unfollow' function to unfollow the profile
        await unfollow(profileid, user.token);
    };

    // Handle accepting a friend request by updating friendship status and making an API call
    const acceptRequestHandler = async () => {
        // Update the friendship status to indicate that the request has been accepted
        setFriendship({
            ...friendship,
            friends: true,
            following: true,
            requestSent: false,
            requestReceived: false,
        });

        // Call the 'acceptRequest' function to accept the friend request
        await acceptRequest(profileid, user.token);
    };

    // Handle unfriending a user by updating friendship status and making an API call
    const unfriendHandler = async () => {
        // Update the friendship status to indicate that the friendship has ended
        setFriendship({
            ...friendship,
            friends: false,
            following: false,
            requestSent: false,
            requestReceived: false,
        });

        // Call the 'unfriend' function to unfriend the user
        await unfriend(profileid, user.token);
    };

    // Handle deleting a friend request by updating friendship status and making an API call
    const deleteRequestHandler = async () => {
        // Update the friendship status to indicate that the friend request has been deleted
        setFriendship({
            ...friendship,
            friends: false,
            following: false,
            requestSent: false,
            requestReceived: false,
        });

        // Call the 'deleteRequest' function to delete the friend request
        await deleteRequest(profileid, user.token);
    };

    return (
        <div className="friendship">
            {friendship?.friends ? (
                // Display a menu for friends with options
                <div className="friends_menu_wrap">
                    <button className="gray_btn" onClick={() => setFriendsMenu(true)}>
                        <img src="../../../icons/friends.png" alt="" />
                        <span>Friends</span>
                    </button>
                    {friendsMenu && (
                        // Display options menu when 'friendsMenu' state is true
                        <div className="open_cover_menu" ref={menu}>
                            <div className="open_cover_menu_item hover1">
                                <img src="../../../icons/favoritesOutline.png" alt="" />
                                Favorites
                            </div>
                            <div className="open_cover_menu_item hover1">
                                <img src="../../../icons/editFriends.png" alt="" />
                                Edit Friend list
                            </div>
                            {friendship?.following ? (
                                // Display 'Unfollow' option if already following, otherwise 'Follow' option
                                <div className="open_cover_menu_item hover1" onClick={() => unfollowHandler()}>
                                    <img src="../../../icons/unfollowOutlined.png" alt="" />
                                    Unfollow
                                </div>
                            ) : (
                                <div className="open_cover_menu_item hover1" onClick={() => followHandler()}>
                                    <img src="../../../icons/unfollowOutlined.png" alt="" />
                                    Follow
                                </div>
                            )}
                            <div className="open_cover_menu_item hover1" onClick={() => unfriendHandler()}>
                                <i className="unfriend_outlined_icon"></i>
                                Unfriend
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                // If not friends, and no friend requests sent or received, show 'Add Friend' button
                !friendship?.requestSent &&
                !friendship?.requestReceived && (
                    <button className="blue_btn" onClick={() => addFriendHandler()}>
                        <img src="../../../icons/addFriend.png" alt="" className="invert" />
                        <span>Add Friend</span>
                    </button>
                )
            )}

            {friendship?.requestSent ? (
                // Display 'Cancel Request' button if a friend request has been sent
                <button className="blue_btn" onClick={() => cancelRequestHandler()}>
                    <img src="../../../icons/cancelRequest.png" className="invert" alt="" />
                    <span>Cancel Request</span>
                </button>
            ) : (
                // If a friend request has been received, show 'Respond' menu options
                friendship?.requestReceived && (
                    <div className="friends_menu_wrap">
                        <button className="gray_btn" onClick={() => setRespondMenu(true)}>
                            <img src="../../../icons/friends.png" alt="" />
                            <span>Respond</span>
                        </button>
                        {respondMenu && (
                            // Display options menu when 'respondMenu' state is true
                            <div className="open_cover_menu" ref={menu1}>
                                <div className="open_cover_menu_item hover1" onClick={() => acceptRequestHandler()}>
                                    Confirm
                                </div>
                                <div className="open_cover_menu_item hover1" onClick={() => deleteRequestHandler()}>
                                    Delete
                                </div>
                            </div>
                        )}
                    </div>
                )
            )}
            <div className="flex">
                {friendship?.following ? (
                    // Display 'Following' button if already following the user
                    <button className="gray_btn" onClick={() => unfollowHandler()}>
                        <img src="../../../icons/follow.png" alt="" />
                        <span>Following</span>
                    </button>
                ) : (
                    // Display 'Follow' button if not following the user
                    <button className="blue_btn" onClick={() => followHandler()}>
                        <img src="../../../icons/follow.png" className="invert" alt="" />
                        <span>Follow</span>
                    </button>
                )}
                <button className={friendship?.friends ? "blue_btn" : "gray_btn"}>
                    {/* Display 'Message' button with the 'invert' class if already friends */}
                    <img src="../../../icons/message.png" className={friendship?.friends ? "invert" : ""} alt="" />
                    <span>Message</span>
                </button>
            </div>
        </div>
    );
}
