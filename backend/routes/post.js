const express = require("express"); // Import the "express" framework, which is used to create the router.
const { createPost, getAllPosts, comment, savePost, deletePost } = require("../controllers/post"); // Import the "createPost & getAllPosts" controller functions to handle creating posts.
const { authUser } = require("../middlewares/auth"); // Import the "authUser" middleware for user authentication.

// Create an instance of the Express router.
const router = express.Router();

// Define a route to handle POST requests for creating a new post.
// It uses the "authUser" middleware to ensure the user is authenticated before creating a post.
router.post("/createPost", authUser, createPost);

// A route to get all posts also allowed to authinticated users only
router.get("/getAllPosts", authUser, getAllPosts);

// A route to make or update a comment on a post also allowed to authinticated users only
router.put("/comment", authUser, comment);

// A route that allows a user to save a post by its unique identifier (ID).
router.put("/savePost/:id", authUser, savePost);

// A route that allows a user to delete a post by its unique identifier (ID).
router.delete("/deletePost/:id", authUser, deletePost);

module.exports = router;
