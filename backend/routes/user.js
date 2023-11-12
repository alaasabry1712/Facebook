const express = require("express");
const {
    register,
    activateAccount,
    login,
    sendVerification,
    findUser,
    sendResetPasswordCode,
    validateResetCode,
    changePassword,
    getProfile,
    updateProfilePicture,
    updateCover,
    updateDetails,
    addFriend,
    cancelRequest,
    follow,
    unfollow,
    acceptRequest,
    unfriend,
    deleteRequest,
    search,
    addToSearchHistory,
    getSearchHistory,
    removeFromSearch,
    getFriendsPageinfo,
    getAllUsers,
    getUserById,
    deleteUser,
    getAllPosts,
    deletePost,
    deleteComment,
} = require("../controllers/user");
const { authUser } = require("../middlewares/auth");

const router = express.Router(); // Create an Express Router

// Route for user registration
router.post("/register", register);

// Route to activate a user account
router.post("/activate", authUser, activateAccount);

// Route for user login
router.post("/login", login);

// Route to send account verification code
router.post("/sendVerification", authUser, sendVerification);

// Route to find user information
router.post("/findUser", findUser);

// Route to send a reset password code
router.post("/sendResetPasswordCode", sendResetPasswordCode);

// Route to validate the reset code
router.post("/validateResetCode", validateResetCode);

// Route to change the user's password
router.post("/changePassword", changePassword);

// Route to get user profile by username
router.get("/getProfile/:username", authUser, getProfile);

// Route to update user profile picture
router.put("/updateProfilePicture", authUser, updateProfilePicture);

// Route to update user cover photo
router.put("/updateCover", authUser, updateCover);

// Route to update user details
router.put("/updateDetails", authUser, updateDetails);

// Route to send a friend request to the user with the specified 'id'.
router.put("/addFriend/:id", authUser, addFriend);

// Route to cancel a friend request sent to the user with the specified 'id'.
router.put("/cancelRequest/:id", authUser, cancelRequest);

// Route to start following another user with the specified 'id'.
router.put("/follow/:id", authUser, follow);

// Route to stop following a user with the specified 'id'.
router.put("/unfollow/:id", authUser, unfollow);

// Route to accept a friend request from the user with the specified 'id'.
router.put("/acceptRequest/:id", authUser, acceptRequest);

// Route to remove a user from the friend list (unfriend).
router.put("/unfriend/:id", authUser, unfriend);

// Route to delete a friend request received from the user with the specified 'id'.
router.put("/deleteRequest/:id", authUser, deleteRequest);

// Route for performing a search based on a provided search term.
// :searchTerm represents the search query in the URL.
router.post("/search/:searchTerm", authUser, search);

// Route for adding a search term to the user's search history.
router.put("/addToSearchHistory", authUser, addToSearchHistory);

// Route for retrieving the user's search history.
router.get("/getSearchHistory", authUser, getSearchHistory);

// Route for removing a specific search term from the user's search history.
router.put("/removeFromSearch", authUser, removeFromSearch);

// Route for retrieving friends info (Friends, Sent Requests, Recieved Requests).
router.get("/getFriendsPageinfo", authUser, getFriendsPageinfo);

// Route to get all users
router.get("/users", getAllUsers);

// Route to get a username by their id
router.get("/users/username/:userId", getUserById);

// Route to delete a user by ID
router.delete("/users/:userId", deleteUser);

// Get all posts
router.get("/posts", getAllPosts);

// Delete a post
router.delete("/posts/:postId", deletePost);

// Delete a comment on a post
router.delete("/posts/:postId/comments/:commentId", deleteComment);

module.exports = router;
