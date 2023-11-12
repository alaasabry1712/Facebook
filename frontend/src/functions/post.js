import axios from "axios";

// createPost function takes several parameters to create a new post on the server.
export const createPost = async (type, background, text, images, user, token) => {
    try {
        // Attempt to make an HTTP POST request to the backend API to create a new post.
        const { data } = await axios.post(
            // Specify the URL for the POST request, obtained from the environment variables.
            `${process.env.REACT_APP_BACKEND_URL}/createPost`,
            {
                // Include data in the request body, including post type, background, text, images, and user.
                type,
                background,
                text,
                images,
                user,
            },
            {
                // Provide request headers, including the user's token for authentication.
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        // If the request is successful, return an object indicating success along with the data.
        return { status: "ok", data };
    } catch (error) {
        // If an error occurs during the request, return the error message received from the response.
        return error.response.data.message;
    }
};

// This function is used to react to a post.
// It sends a PUT request to the '/reactPost' endpoint of the backend server.
// The request includes the post ID, the type of reaction, and the user's token in the Authorization header.
// If the request is successful, the function returns the string "ok".
// If the request fails, the function returns the error message from the server.
export const reactPost = async (postId, react, token) => {
    try {
        // Send a PUT request to the '/reactPost' endpoint of the backend server
        const { data } = await axios.put(
            `${process.env.REACT_APP_BACKEND_URL}/reactPost`,
            {
                postId, // The ID of the post to react to
                react, // The type of reaction
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`, // The user's token in the Authorization header
                },
            }
        );

        // If the request is successful, return the string "ok"
        return "ok";
    } catch (error) {
        // If the request fails, return the error message from the server
        return error.response.data.message;
    }
};

// This function is used to get the reactions for a post.
// It sends a GET request to the '/getReacts/:postId' endpoint of the backend server.
// The request includes the post ID in the URL and the user's token in the Authorization header.
// If the request is successful, the function returns the data from the server.
// If the request fails, the function returns the error message from the server.
export const getReacts = async (postId, token) => {
    try {
        // Send a GET request to the '/getReacts/:postId' endpoint of the backend server
        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getReacts/${postId}`, {
            headers: {
                Authorization: `Bearer ${token}`, // The user's token in the Authorization header
            },
        });

        // If the request is successful, return the data from the server
        return data;
    } catch (error) {
        // If the request fails, return the error message from the server
        return error.response.data.message;
    }
};

/*  Submits a comment for a post.
    postId - The ID of the post to comment on.
    comment - The text of the comment.
    image - An optional image URL for the comment.
    token - User's authentication token.
    @returns {object|string} - Returns the comment data if successful, or an error message on failure. */
export const comment = async (postId, comment, image, token) => {
    try {
        const { data } = await axios.put(
            `${process.env.REACT_APP_BACKEND_URL}/comment`,
            {
                postId,
                comment,
                image,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return data; // Return the comment data
    } catch (error) {
        return error.response.data.message; // Return an error message on failure
    }
};

/* Asynchronous function to save or unsave a post on the server.
    postId - The unique identifier of the post to be saved or unsaved.
    token - Authentication token to authorize the request.
    @returns {Promise<Object|string>} - A Promise that resolves to the response data or an error message. */
export const savePost = async (postId, token) => {
    try {
        // Send a PUT request to the server's "savePost" endpoint with postId and an empty object.
        const { data } = await axios.put(
            `${process.env.REACT_APP_BACKEND_URL}/savePost/${postId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        // Return the response data, which typically confirms the success of the save operation.
        return data;
    } catch (error) {
        // In case of an error, return the error message from the server's response.
        return error.response.data.message;
    }
};

/* Asynchronous function to delete a post on the server.
    postId - The unique identifier of the post to be deleted.
    token - Authentication token to authorize the request.
    @returns {Promise<Object|string>} - A Promise that resolves to the response data or an error message. */
export const deletePost = async (postId, token) => {
    try {
        // Send a DELETE request to the server's "deletePost" endpoint with the postId.
        const { data } = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/deletePost/${postId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Return the response data, which typically confirms the success of the delete operation.
        return data;
    } catch (error) {
        // In case of an error, return the error message from the server's response.
        return error.response.data.message;
    }
};
