const mongoose = require("mongoose");

// Extract the `ObjectId` data type from Mongoose
const { ObjectId } = mongoose.Schema;

// Define the schema for the "Post" collection
const postSchema = new mongoose.Schema(
    {
        // Type of the post (e.g., "profilePicture," "cover," or `null`)
        type: {
            type: String,
            enum: ["profilePicture", "coverPicture", null], // Enumerated values
            default: null, // Default value if not provided
        },
        // Textual content of the post
        text: {
            type: String,
        },
        // Array of image URLs associated with the post
        images: {
            type: Array,
        },
        // Reference to the user who created the post (from the "User" collection)
        user: {
            type: ObjectId,
            ref: "User", // Reference to the "User" collection
            required: true, // Required field
        },
        // Additional background information or settings for the post
        background: {
            type: String,
        },
        // Array of comments on the post
        comments: [
            {
                // Text content of a comment
                comment: {
                    type: String,
                },
                // URL of an image associated with the comment
                image: {
                    type: String,
                },
                // Reference to the user who made the comment (from the "User" collection)
                commentBy: {
                    type: ObjectId,
                    ref: "User", // Reference to the "User" collection
                },
                // Timestamp for when the comment was created (defaults to current date)
                commentAt: {
                    type: Date,
                    required: true,
                },
            },
        ],
    },
    {
        timestamps: true, // Automatically add createdAt and updatedAt timestamps
    }
);

// Export the "Post" model, which can be used to interact with the "Post" collection
module.exports = mongoose.model("Post", postSchema);
