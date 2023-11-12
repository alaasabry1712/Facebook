const mongoose = require("mongoose");

// Extract the ObjectId type from Mongoose's Schema module
const { ObjectId } = mongoose.Schema;

// Create a new Mongoose schema for the "React" collection
const reactSchema = new mongoose.Schema({
    // Field for the type of reaction (like, love, haha, sad, angry, wow)
    react: {
        type: String,
        enum: ["like", "love", "haha", "sad", "angry", "wow", "care"], // Allowed values
        required: true, // This field is required
    },

    // Reference to the related post using its ObjectId
    postRef: {
        type: ObjectId,
        ref: "Post", // References the "Post" collection
    },

    // Reference to the user who made the reaction using their ObjectId
    reactBy: {
        type: ObjectId,
        ref: "User", // References the "User" collection
    },
});

// Export the Mongoose model for the "React" collection
module.exports = mongoose.model("React", reactSchema);
