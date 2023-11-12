// Import the 'fs' (File System) module to interact with the file system.
const fs = require("fs");

// Export a middleware function as a module. This function handles file upload validation.
module.exports = async function (req, res, next) {
    try {
        // Check if there are no files in the request or if there are no files in the 'req.files' object.
        // Object.values is used to convert the values of the req.files object into an array.
        // And Object.values(req.files) returns an array of arrays containing file data.
        // So the flat() method is used to flatten that nested array structure into a single array.
        if (!req.files || Object.values(req.files).flat().length === 0) {
            // If no files are found, return a 400 Bad Request response with a JSON message.
            return res.status(400).json({ message: "No files selected." });
        }

        // Use Object.values to extract the values (file arrays) from the 'req.files' object and flatten them into a single array.
        let files = Object.values(req.files).flat();

        // Iterate through each file in the 'files' array.
        files.forEach((file) => {
            // Check if the file's MIME type is not one of the allowed image formats (JPEG, PNG, GIF, or WebP).
            if (
                file.mimetype !== "image/jpeg" &&
                file.mimetype !== "image/png" &&
                file.mimetype !== "image/gif" &&
                file.mimetype !== "image/webp"
            ) {
                // If the format is not supported, remove the temporary file and return a 400 Bad Request response with an error message.
                removeTmp(file.tempFilePath);
                return res.status(400).json({ message: "Unsupported format." });
            }

            // Check if the file size exceeds 5 megabytes (5 * 1024 * 1024 bytes).
            if (file.size > 1024 * 1024 * 5) {
                // If the file is too large, remove the temporary file and return a 400 Bad Request response with an error message.
                removeTmp(file.tempFilePath);
                return res.status(400).json({ message: "File size is too large." });
            }
        });

        // If all validation checks pass, call the 'next' function to proceed to the next middleware or route handler.
        next();
    } catch (error) {
        // If an error occurs during the validation process, return a 500 Internal Server Error response with an error message.
        return res.status(500).json({ message: error.message });
    }
};

// Define a function to remove a temporary file. This function is used to clean up temporary files after validation.
const removeTmp = (path) => {
    // Use the 'fs.unlink' method to delete the file located at the specified 'path'.
    fs.unlink(path, (err) => {
        if (err) throw err; // If an error occurs while deleting the file, throw an error to handle it.
    });
};
