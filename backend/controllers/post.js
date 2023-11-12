const Post = require("../models/Post");
const User = require("../models/User");

// Define a controller function to handle the creation of a new post.
exports.createPost = async (req, res) => {
    try {
        // Create a new post based on the request body and save it to the database.
        const post = await new Post(req.body).save();
        // Respond with the newly created post in JSON format.
        res.json(post);
    } catch (error) {
        // Handle errors by sending a 500 Internal Server Error response with an error message.
        return res.status(500).json({ message: error.message });
    }
};

// Controller function  to retrieve a list of posts for a user and the users they are following
exports.getAllPosts = async (req, res) => {
    try {
        // 1. Fetch the list of users that the authenticated user is following.
        const followingTemp = await User.findById(req.user.id).select("following");
        const following = followingTemp.following;

        // 2. Create an array of promises to fetch posts for each followed user.
        const promises = following.map((user) => {
            return Post.find({ user: user })
                .populate("user", "first_name last_name picture username cover")
                .populate("comments.commentBy", "first_name last_name picture username")
                .sort({ createdAt: -1 })
                .limit(10);
        });

        // 3. Execute the promises in parallel to retrieve posts for followed users.
        const followingPosts = await (await Promise.all(promises)).flat();

        // 4. Retrieve posts for the authenticated user.
        const userPosts = await Post.find({ user: req.user.id })
            .populate("user", "first_name last_name picture username cover")
            .populate("comments.commentBy", "first_name last_name picture username")
            .sort({ createdAt: -1 })
            .limit(10);

        // 5. Combine posts from followed users and the authenticated user.
        followingPosts.push(...[...userPosts]);

        // 6. Sort the combined posts by creation date in descending order.
        followingPosts.sort((a, b) => {
            return b.createdAt - a.createdAt;
        });

        // 7. Send the sorted list of posts as a JSON response.
        res.json(followingPosts);
    } catch (error) {
        // Handle errors and send a 500 Internal Server Error response.
        return res.status(500).json({ message: error.message });
    }
};

// Controller function for adding a new comment to a post
exports.comment = async (req, res) => {
    try {
        // Extract the comment, image, and postId from the request body
        const { comment, image, postId } = req.body;

        // Update the post document in the database to add a new comment
        let newComments = await Post.findByIdAndUpdate(
            postId,
            {
                $push: {
                    comments: {
                        comment: comment,
                        image: image,
                        commentBy: req.user.id,
                        commentAt: new Date(),
                    },
                },
            },
            {
                new: true, // Return the updated post document
            }
        )
            // Populate the 'commentBy' field to get user details
            .populate("comments.commentBy", "picture first_name last_name username");

        // Respond with the comments array of the updated post
        res.json(newComments.comments);
    } catch (error) {
        // Handle errors by returning a 500 Internal Server Error response
        return res.status(500).json({ message: error.message });
    }
};

// // Controller functions that allows a user to save or unsave a post.
// exports.savePost = async (req, res) => {
//     try {
//         const postId = req.params.id; // Extract the post ID from the route parameters.
//         const user = await User.findById(req.user.id); // Find the user making the request using their ID.
//         // Check if the user has already saved the post by searching their savedPosts array.
//         const check = user?.savedPosts.find((post) => post.post.toString() == postId);

//         if (check) {
//             // If the post is already saved, remove it from the user's savedPosts.
//             await User.findByIdAndUpdate(req.user.id, {
//                 $pull: {
//                     savedPosts: {
//                         _id: check._id, // Remove the post based on its unique ID.
//                     },
//                 },
//             });
//         } else {
//             // If the post is not saved, add it to the user's savedPosts array.
//             await User.findByIdAndUpdate(req.user.id, {
//                 $push: {
//                     savedPosts: {
//                         post: postId, // The ID of the post to be saved.
//                         savedAt: new Date(), // Timestamp of when it was saved.
//                     },
//                 },
//             });
//         }
//     } catch (error) {
//         // If any errors occur during this process, return a 500 Internal Server Error along with an error message.
//         return res.status(500).json({ message: error.message });
//     }
// };

// Controller functions that allows a user to save or unsave a post.
exports.savePost = async (req, res) => {
    try {
        const postId = req.params.id; // Extract the post ID from the route parameters.
        const userId = req.user.id; // Extract the user ID from the request.

        // Find the user making the request using their ID.
        const user = await User.findById(userId);

        // Check if the user has already saved the post by searching their savedPosts array.
        const savedPost = user?.savedPosts.find((post) => post.post.toString() == postId);

        // Define the update operation based on whether the post is already saved or not.
        const updateOperation = savedPost
            ? { $pull: { savedPosts: { _id: savedPost._id } } } // If saved, remove it.
            : { $push: { savedPosts: { post: postId, savedAt: new Date() } } }; // If not saved, add it.

        // Update the user's savedPosts array.
        await User.findByIdAndUpdate(userId, updateOperation);
    } catch (error) {
        // If any errors occur during this process, return a 500 Internal Server Error along with an error message.
        return res.status(500).json({ message: error.message });
    }
};

// Controller function that allows a user to delete a post.
exports.deletePost = async (req, res) => {
    try {
        // Extract the post ID from the route parameters.
        const postId = req.params.id;

        // Remove the post with the given ID from the database.
        await Post.findByIdAndRemove(postId);

        // If the operation was successful, send a response with a status of "ok".
        res.json({ status: "ok" });
    } catch (error) {
        // If any errors occur during this process, return a 500 Internal Server Error along with an error message.
        return res.status(500).json({ message: error.message });
    }
};
