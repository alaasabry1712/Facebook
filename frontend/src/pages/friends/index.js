import "./style.css";
import { useEffect, useReducer } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Header from "../../components/header";
import { friendspage } from "../../functions/reducers";
import { getFriendsPageinfo } from "../../functions/user";
import Card from "./Card";

export default function Friends() {
    const { user } = useSelector((state) => ({ ...state })); // Get the user object from the Redux store.
    const { type } = useParams(); // Get the 'type' parameter from the route.

    // Use the React useReducer hook to manage the state of this component.
    // The state includes whether data is currently being loaded (loading),
    // any error that occurred (error), and the data that was loaded (data).
    const [{ loading, error, data }, dispatch] = useReducer(friendspage, {
        loading: false,
        data: {},
        error: "",
    });

    // Use the useEffect hook to fetch data when the component mounts.
    useEffect(() => {
        getData();
    }, []);

    // Define a function to fetch friends' data.
    const getData = async () => {
        // Dispatch a 'FRIENDS_REQUEST' action to indicate that data fetching has started.
        dispatch({ type: "FRIENDS_REQUEST" });

        // Fetch data using the 'getFriendsPageinfo' function.
        const data = await getFriendsPageinfo(user.token);

        // Check if the data status is "ok" or if an error occurred.
        if (data.status === "ok") {
            // Dispatch a 'FRIENDS_SUCCESS' action with the fetched data.
            dispatch({ type: "FRIENDS_SUCCESS", payload: data.data });
        } else {
            // Dispatch a 'FRIENDS_ERROR' action with the error data.
            dispatch({ type: "FRIENDS_ERROR", payload: data.data });
        }
    };

    /*//* as for the "type" attribute 
    //? 1. undefined or "all": This represents the "All Friends" section.
    //? 2."requests": This represents the "Friend Requests" section.
    //? 3."sent": This represents the "Sent Requests" section. */

    return (
        <>
            <Header page="friends" />
            <div className="friends">
                <div className="friends_left">
                    <div className="friends_left_header">
                        <h3>Friends</h3>
                        <div className="small_circle inactive-icon">
                            <i className="settings_filled_icon"></i>
                        </div>
                    </div>
                    <div className="friends_left_wrap">
                        {/* Home Link */}
                        <Link to="/friends" className={`mmenu_item hover3 ${type === undefined && "active_friends"}`}>
                            <div className="small_circle">
                                <i className="friends_home_icon"></i>
                            </div>
                            <span>Home</span>
                            <div className="rArrow">
                                <i className="right_icon"></i>
                            </div>
                        </Link>

                        {/* Friend Requests Link */}
                        <Link
                            to="/friends/requests"
                            className={`mmenu_item hover3 ${type === "requests" && "active_friends"}`}
                        >
                            <div className="small_circle">
                                <i className="friends_requests_icon"></i>
                            </div>
                            <span>Friend Requests</span>
                            <div className="rArrow">
                                <i className="right_icon"></i>
                            </div>
                        </Link>

                        {/* Sent Requests Link */}
                        <Link to="/friends/sent" className={`mmenu_item hover3 ${type === "sent" && "active_friends"}`}>
                            <div className="small_circle">
                                <i className="friends_requests_icon"></i>
                            </div>
                            <span>Sent Requests</span>
                            <div className="rArrow">
                                <i className="right_icon"></i>
                            </div>
                        </Link>

                        {/* Suggestions Link */}
                        <div className="mmenu_item inactive-icon">
                            <div className="small_circle">
                                <i className="friends_suggestions_icon"></i>
                            </div>
                            <span>Suggestions</span>
                            <div className="rArrow">
                                <i className="right_icon"></i>
                            </div>
                        </div>

                        {/* All Friends Link */}
                        <Link to="/friends/all" className={`mmenu_item hover3 ${type === "all" && "active_friends"}`}>
                            <div className="small_circle">
                                <i className="all_friends_icon"></i>
                            </div>
                            <span>All Friends</span>
                            <div className="rArrow">
                                <i className="right_icon"></i>
                            </div>
                        </Link>

                        {/* Birthdays Link */}
                        <div className="mmenu_item inactive-icon">
                            <div className="small_circle">
                                <i className="birthdays_icon"></i>
                            </div>
                            <span>Birthdays</span>
                            <div className="rArrow">
                                <i className="right_icon"></i>
                            </div>
                        </div>

                        {/* Custom Lists Link */}
                        <div className="mmenu_item inactive-icon">
                            <div className="small_circle">
                                <i className="all_friends_icon"></i>
                            </div>
                            <span>Custom Lists</span>
                            <div className="rArrow">
                                <i className="right_icon"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="friends_right">
                    {/* Conditional rendering: Display if type is either undefined or "requests" */}
                    {(type === undefined || type === "requests") && (
                        <div className="friends_right_wrap">
                            {/* Header for the "Friend Requests" section */}
                            <div className="friends_left_header">
                                <h3>Friend Requests</h3>
                                {/* Display "See all" link if type is undefined */}
                                {type === undefined && (
                                    <Link to="/friends/requests" className="see_link hover3">
                                        See all
                                    </Link>
                                )}
                            </div>
                            {/* Container for rendering friend requests */}
                            <div className="flex_wrap">
                                {/* Mapping and rendering Friend Requests */}
                                {data.requests &&
                                    data.requests.map((user) => (
                                        <Card userr={user} key={user._id} type="request" getData={getData} />
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* Conditional rendering: Display if type is either undefined or "sent" */}
                    {(type === undefined || type === "sent") && (
                        <div className="friends_right_wrap">
                            {/* Header for the "Sent Requests" section */}
                            <div className="friends_left_header">
                                <h3>Sent Requests</h3>
                                {/* Display "See all" link if type is undefined */}
                                {type === undefined && (
                                    <Link to="/friends/sent" className="see_link hover3">
                                        See all
                                    </Link>
                                )}
                            </div>
                            {/* Container for rendering sent friend requests */}
                            <div className="flex_wrap">
                                {/* Mapping and rendering Sent Requests */}
                                {data.sentRequests &&
                                    data.sentRequests.map((user) => (
                                        <Card userr={user} key={user._id} type="sent" getData={getData} />
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* Conditional rendering: Display if type is either undefined or "all" */}
                    {(type === undefined || type === "all") && (
                        <div className="friends_right_wrap">
                            {/* Header for the "Friends" section */}
                            <div className="friends_left_header">
                                <h3>Friends</h3>
                                {/* Display "See all" link if type is undefined */}
                                {type === undefined && (
                                    <Link to="/friends/all" className="see_link hover3">
                                        See all
                                    </Link>
                                )}
                            </div>
                            {/* Container for rendering friends */}
                            <div className="flex_wrap">
                                {/* Mapping and rendering friends using "Card" components */}
                                {data.friends &&
                                    data.friends.map((user) => (
                                        <Card userr={user} key={user._id} type="friends" getData={getData} />
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
