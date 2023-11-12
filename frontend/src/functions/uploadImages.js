import axios from "axios";

/**
 * Uploads images to the server using a POST request.
 * @param {FormData} formData - The form data containing the image files to upload.
 * @param {string} path - The path where the images should be stored on the server.
 * @param {string} token - The user's authentication token for authorization.
 * @returns {Promise} A promise that resolves to the uploaded image data or an error message.
 */

export const uploadImages = async (formData, path, token) => {
    try {
        // Send a POST request to upload images with the provided form data, path, and authorization token
        const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/uploadImages`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "content-type": "multipart/form-data",
            },
        });
        // Return the uploaded image data
        return data;
    } catch (error) {
        // Return the error message in case of a request error
        return error.response.data.message;
    }
};
