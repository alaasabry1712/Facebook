const cloudinary = require("cloudinary"); // Cloudinary module for image upload and storage
const fs = require("fs"); // Node.js filesystem module for file operations

// Configure Cloudinary with API credentials loaded from environment variables
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// This is a controller function for handling image uploads to Cloudinary.
// The controller is responsible for processing the HTTP request and sending an HTTP response.

// Export the 'uploadImages' function as part of a module.
exports.uploadImages = async (req, res) => {
    try {
        // Extract the 'path' value from the request body.
        const { path } = req.body;

        // Get an array of uploaded files from the request and flatten it.
        let files = Object.values(req.files).flat();

        // Initialize an empty array to store the uploaded image URLs.
        let images = [];

        // Iterate through each uploaded file.
        for (const file of files) {
            // Upload the file to Cloudinary using the 'uploadToCloudinary' function.
            const url = await uploadToCloudinary(file, path);

            // Push the URL of the uploaded image to the 'images' array.
            images.push(url);

            // Remove the temporary file from the server.
            removeTmp(file.tempFilePath);
        }

        // Send a JSON response containing the URLs of the uploaded images.
        res.json(images);
    } catch (error) {
        // If an error occurs during image upload processing, return a 500 Internal Server Error response with an error message.
        return res.status(500).json({ message: error.message });
    }
};

/*
This function is responsible for using the Cloudinary API to search for images,
based on the specified parameters (path, sort order, and maximum results). 
It retrieves the search results and sends them as a JSON response to the client.
*/
exports.listImages = async (req, res) => {
    // Extract the relevant parameters from the request body
    const { path, sort, max } = req.body;

    // Use the Cloudinary API to search for images
    cloudinary.v2.search
        .expression(`${path}`) // Search for images in the specified path
        .sort_by("created_at", `${sort}`) // Sort the results by created_at attribute
        .max_results(max) // Limit the maximum number of results
        .execute()
        .then((result) => {
            // Send the search results as a JSON response
            res.json(result);
        })
        .catch((err) => {
            // Handle any errors that occur during the search
            console.log(err.error.message);
        });
};

// This function uploads a file to Cloudinary and returns the URL of the uploaded image.
const uploadToCloudinary = async (file, path) => {
    return new Promise((resolve) => {
        // Use the Cloudinary API to upload the file with specified options.
        cloudinary.v2.uploader.upload(
            file.tempFilePath, // Temporary file path
            {
                folder: path, // Folder in Cloudinary where the image will be stored
            },
            (err, res) => {
                if (err) {
                    // If the upload fails, remove the temporary file and return a 400 Bad Request response with an error message.
                    removeTmp(file.tempFilePath);
                    return res.status(400).json({ message: "Image upload failed." });
                }

                // Resolve the promise with the URL of the uploaded image.
                resolve({
                    url: res.secure_url,
                });
            }
        );
    });
};

// This function is used to remove a temporary file from the server.
const removeTmp = (path) => {
    // Use the 'fs.unlink' method to delete the file located at the specified 'path'.
    fs.unlink(path, (err) => {
        if (err) throw err; // If an error occurs while deleting the file, throw an error to handle it.
    });
};
