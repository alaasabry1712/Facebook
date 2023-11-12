import { useEffect, useRef, useState } from "react";
import { Return, Search } from "../../svg";
import useClickOutside from "../../helpers/clickOutside";
import { addToSearchHistory, getSearchHistory, removeFromSearch, search } from "../../functions/user";
import { Link } from "react-router-dom";

export default function SearchMenu({ color, setShowSearchMenu, token }) {
    const [iconVisible, setIconVisible] = useState(true); // Control the visibility of the search icon
    const [searchTerm, setSearchTerm] = useState(""); // Store the user's search input
    const [results, setResults] = useState(""); // Store the search results
    const [searchHistory, setSearchHistory] = useState([]); // Store the user's search history
    const menu = useRef(null); // Create a reference for the search menu
    const input = useRef(null); // Create a reference for the search input field

    // Use the custom hook 'useClickOutside' to detect clicks outside the search menu
    useClickOutside(menu, () => {
        setShowSearchMenu(false); // Close the search menu when clicking outside
    });

    // Use 'useEffect' to fetch the search history when the component mounts
    useEffect(() => {
        getHistory();
    }, []);

    // Define an asynchronous function to fetch and update the user's search history
    const getHistory = async () => {
        const res = await getSearchHistory(token); // Fetch search history data from the server
        setSearchHistory(res); // Update the 'searchHistory' state with the fetched data
    };

    // Use 'useEffect' to automatically focus on the search input when the component mounts
    useEffect(() => {
        input.current.focus();
    }, []);

    // Define a function to handle the search operation
    const searchHandler = async () => {
        if (searchTerm === "") {
            setResults(""); // If the search term is empty, clear the results
        } else {
            const res = await search(searchTerm, token); // Perform a search using the search term and the user's token
            setResults(res); // Update the 'results' state with the search results received from the server
        }
    };

    // Define a function to handle adding a search user to the search history
    const addToSearchHistoryHandler = async (searchUser) => {
        await addToSearchHistory(searchUser, token); // Add the specified search user to the user's search history
        getHistory(); // Refresh the search history by fetching the updated list of search history items
    };

    // Define a function to handle removing a search user from the search history
    const handleRemove = async (searchUser) => {
        removeFromSearch(searchUser, token); // Remove the specified search user from the user's search history
        getHistory(); // Refresh the search history by fetching the updated list of search history items
    };

    return (
        <div className="header_left search_area scrollbar" ref={menu}>
            <div className="search_wrap">
                {/* Container for the search bar and related elements */}
                <div className="header_logo">
                    {/* Logo or return button for exiting the search menu */}
                    <div
                        className="circle hover1"
                        onClick={() => {
                            // When clicked, this button closes the search menu
                            setShowSearchMenu(false);
                        }}
                    >
                        {/* Display the Return icon in the specified color */}
                        <Return color={color} />
                    </div>
                </div>
                {/* Search input and search icon */}
                <div
                    className="search"
                    onClick={() => {
                        // When clicked, focus on the search input
                        input.current.focus();
                    }}
                >
                    {/* Check if the search icon should be visible */}
                    {iconVisible && (
                        <div>
                            {/* Display the Search icon with the specified color */}
                            <Search color={color} />
                        </div>
                    )}
                    <input
                        type="text"
                        placeholder="Search Facebook"
                        ref={input} // Reference to the search input field
                        value={searchTerm} // Control the input value with the searchTerm state
                        onChange={(e) => {
                            // Handle changes in the input field
                            setSearchTerm(e.target.value);
                        }}
                        onKeyUp={searchHandler} // Trigger the searchHandler on key release
                        onFocus={() => {
                            // When the input field is in focus, hide the search icon
                            setIconVisible(false);
                        }}
                        onBlur={() => {
                            // When the input field loses focus, show the search icon
                            setIconVisible(true);
                        }}
                    />
                </div>
            </div>

            {/* Check if results are empty */}
            {results === "" && (
                // If results are empty, display the search history header
                <div className="search_history_header">
                    {/* Show the text "Recent searches" */}
                    <span>Recent searches</span>
                    {/* Display the "Edit" link for managing search history */}
                    <a>Edit</a>
                </div>
            )}

            {/* Render the search history section */}
            <div className="search_history scrollbar">
                {/* Check if there is search history available and no search results are present */}
                {searchHistory &&
                    results === "" &&
                    searchHistory
                        .sort((a, b) => {
                            return new Date(b.createdAt) - new Date(a.createdAt);
                            /* Sort search history by createdAt date in descending order */
                        })
                        .map((user) => (
                            /* Map through the sorted search history and display user entries */
                            <div className="search_user_item hover1" key={user._id}>
                                {/* Each user entry in search history */}
                                <Link
                                    className="flex"
                                    to={`/profile/${user.user.username}`}
                                    onClick={() => addToSearchHistoryHandler(user.user._id)}
                                >
                                    {/* Link to the user's profile with a click event */}
                                    <img src={user.user.picture} alt="" />
                                    {/* Display the user's profile picture */}
                                    <span>
                                        {user.user.first_name} {user.user.last_name}
                                        {/* Show the user's first and last name */}
                                    </span>
                                </Link>
                                {/* Display an exit icon with a click event for removing the user from history */}
                                <i
                                    className="exit_icon"
                                    onClick={() => {
                                        handleRemove(user.user._id);
                                    }}
                                ></i>
                            </div>
                        ))}
            </div>

            {/* Render the search results section */}
            <div className="search_results scrollbar">
                {results &&
                    results.map((user) => (
                        /* Map through the search results and display user entries */
                        <Link
                            to={`/profile/${user.username}`}
                            className="search_user_item hover1"
                            onClick={() => addToSearchHistoryHandler(user._id)}
                            key={user._id}
                        >
                            {/* Link to the user's profile with a click event */}
                            <img src={user.picture} alt="" />
                            {/* Display the user's profile picture */}
                            <span>
                                {user.first_name} {user.last_name}
                                {/* Show the user's first and last name */}
                            </span>
                        </Link>
                    ))}
            </div>
        </div>
    );
}
