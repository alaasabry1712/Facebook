const express = require("express");
const { reactPost, getReactions } = require("../controllers/react");
const { authUser } = require("../middlewares/auth");

const router = express.Router();

// Define a route to handle reacting to a post (Creating or Updading a Reaction)
router.put("/reactPost", authUser, reactPost);

// Define a route to get reactions for a specific post by its ID (HTTP GET method)
router.get("/getReacts/:id", authUser, getReactions);

// Export the configured router
module.exports = router;
