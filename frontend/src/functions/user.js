import axios from "axios";

/**
 * Updates the user's profile picture by sending a PUT request to the server.
 * @param {string} url - The URL of the new profile picture.
 * @param {string} token - The user's authentication token for authorization.
 * @returns {Promise} A promise that resolves to "ok" if the update is successful, or an error message if there's a failure.
 */
export const updateProfilePicture = async (url, token) => {
    try {
        // Send a PUT request to update the profile picture with the provided URL and authorization token
        const { data } = await axios.put(
            `${process.env.REACT_APP_BACKEND_URL}/updateProfilePicture`,
            {
                url,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        // Return "ok" to indicate a successful update
        return "ok";
    } catch (error) {
        // Return the error message in case of a request error
        return error.response.data.message;
    }
};

/**
 * Updates the user's cover photo by sending a PUT request to the server.
 * @param {string} url - The URL of the new cover photo.
 * @param {string} token - The user's authentication token for authorization.
 * @returns {Promise} A promise that resolves to "ok" if the update is successful, or an error message if there's a failure.
 */
export const updateCover = async (url, token) => {
    try {
        // Send a PUT request to update the cover photo with the provided URL and authorization token
        const { data } = await axios.put(
            `${process.env.REACT_APP_BACKEND_URL}/updateCover`,
            {
                url,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        // Return "ok" to indicate a successful update
        return "ok";
    } catch (error) {
        // Return the error message in case of a request error
        return error.response.data.message;
    }
};

// Sends a friend request to another user.
// Parameters:
//   - id (string): The ID of the user to whom the friend request is being sent.
//   - token (string): User authentication token for authorization.
// Returns: A promise that resolves to either "ok" (indicating success) or an error message if the request fails.
export const addFriend = async (id, token) => {
    try {
        const { data } = await axios.put(
            `${process.env.REACT_APP_BACKEND_URL}/addFriend/${id}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return "ok";
    } catch (error) {
        return error.response.data.message;
    }
};

// Cancels a previously sent friend request.
export const cancelRequest = async (id, token) => {
    try {
        const { data } = await axios.put(
            `${process.env.REACT_APP_BACKEND_URL}/cancelRequest/${id}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return "ok";
    } catch (error) {
        return error.response.data.message;
    }
};

// Follows another user.
export const follow = async (id, token) => {
    try {
        const { data } = await axios.put(
            `${process.env.REACT_APP_BACKEND_URL}/follow/${id}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return "ok";
    } catch (error) {
        return error.response.data.message;
    }
};

// Unfollows another user.
export const unfollow = async (id, token) => {
    try {
        const { data } = await axios.put(
            `${process.env.REACT_APP_BACKEND_URL}/unfollow/${id}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return "ok";
    } catch (error) {
        return error.response.data.message;
    }
};

// Accepts a friend request from another user.
export const acceptRequest = async (id, token) => {
    try {
        const { data } = await axios.put(
            `${process.env.REACT_APP_BACKEND_URL}/acceptRequest/${id}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return "ok";
    } catch (error) {
        return error.response.data.message;
    }
};

// Unfriends another user.
export const unfriend = async (id, token) => {
    try {
        const { data } = await axios.put(
            `${process.env.REACT_APP_BACKEND_URL}/unfriend/${id}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return "ok";
    } catch (error) {
        return error.response.data.message;
    }
};

// Deletes a friend request received from another user.
export const deleteRequest = async (id, token) => {
    try {
        const { data } = await axios.put(
            `${process.env.REACT_APP_BACKEND_URL}/deleteRequest/${id}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return "ok";
    } catch (error) {
        return error.response.data.message;
    }
};

// Function to send a search request to the server
export const search = async (searchTerm, token) => {
    try {
        // Define the URL and headers for the request.
        const url = `${process.env.REACT_APP_BACKEND_URL}/search/${searchTerm}`;
        const headers = { Authorization: `Bearer ${token}` };

        // Send a POST request to the server.
        const { data } = await axios.post(url, {}, { headers });

        // Return the data from the server's response.
        return data;
    } catch (error) {
        // If an error occurs, return the error message from the server's response.
        return error.response.data.message;
    }
};

// Function to add a user to the search history.
export const addToSearchHistory = async (searchUser, token) => {
    try {
        // Define the URL and headers for the request.
        const url = `${process.env.REACT_APP_BACKEND_URL}/addToSearchHistory`;
        const headers = { Authorization: `Bearer ${token}` };

        // Send a PUT request to the server with the searchUser in the request body.
        const { data } = await axios.put(url, { searchUser }, { headers });

        // Return the data from the server's response.
        return data;
    } catch (error) {
        // If an error occurs, return the error message from the server's response.
        return error.response.data.message;
    }
};

// Function to retrieve the user's search history.
export const getSearchHistory = async (token) => {
    try {
        // Define the URL and headers for the request.
        const url = `${process.env.REACT_APP_BACKEND_URL}/getSearchHistory`;
        const headers = { Authorization: `Bearer ${token}` };

        // Send a GET request to the server.
        const { data } = await axios.get(url, { headers });

        // Return the data from the server's response.
        return data;
    } catch (error) {
        // If an error occurs, return the error message from the server's response.
        return error.response.data.message;
    }
};

// Function to remove a user from the search history.
export const removeFromSearch = async (searchUser, token) => {
    try {
        // Define the URL and headers for the request.
        const url = `${process.env.REACT_APP_BACKEND_URL}/removeFromSearch`;
        const headers = { Authorization: `Bearer ${token}` };

        // Send a PUT request to the server with the searchUser in the request body.
        const { data } = await axios.put(url, { searchUser }, { headers });

        // Return the data from the server's response.
        return data;
    } catch (error) {
        // If an error occurs, return the error message from the server's response.
        return error.response.data.message;
    }
};

// This is a function for getting a user's friends page information.
export const getFriendsPageinfo = async (token) => {
    try {
        // Define the URL for the request.
        const url = `${process.env.REACT_APP_BACKEND_URL}/getFriendsPageinfo`;

        // Define the headers for the request.
        // The headers include an Authorization field with the user's token.
        const headers = { Authorization: `Bearer ${token}` };

        // Send a GET request to the server with the defined URL and headers.
        // The 'axios.get' function returns a promise that resolves to the server's response.
        // We use the 'await' keyword to wait for this promise to resolve before continuing with the function.
        const { data } = await axios.get(url, { headers });

        // If the request was successful, return an object with a status of "ok" and the data from the server's response.
        return { status: "ok", data };
    } catch (error) {
        // If an error occurs during the request, catch it here.

        // The error object includes a 'response' property that contains the server's response to our request.
        // The 'data' property of this response contains any data sent by the server, including an error message.
        // Return this error message.
        return error.response.data.message;
    }
};
