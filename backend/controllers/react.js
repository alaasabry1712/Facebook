const React = require("../models/React");
const User = require("../models/User");
const mongoose = require("mongoose");

// Function to handle creating or modifying reactions to a post
exports.reactPost = async (req, res) => {
    try {
        const { postId, react } = req.body; // Extract post ID and reaction from the request body

        const check = await React.findOne({
            postRef: postId,
            reactBy: mongoose.Types.ObjectId(req.user.id),
        });

        // Check if the user has already reacted to the post
        if (check == null) {
            // If no existing reaction is found, user is reacting for the first time
            const newReact = new React({
                react: react,
                postRef: postId,
                reactBy: req.user.id,
            });
            // Create a new reaction document with type and user ID
            await newReact.save(); // Save the new reaction to the database
        } else {
            // If an existing reaction is found (user has reacted before)
            if (check.react == react) {
                // If the user wants to remove their reaction
                await React.findByIdAndRemove(check._id); // Remove the existing reaction
            } else {
                // If the user wants to change their reaction
                await React.findByIdAndUpdate(check._id, {
                    react: react, // Update the existing reaction with the new reaction type
                });
            }
        }
    } catch (error) {
        // Error handling: return an error response with a 500 status code
        return res.status(500).json({ message: error.message });
    }
};

// Function to retrieve and organize reactions for a specific post
// exports.getReacts = async (req, res) => {
//     try {
//         // Fetch all reactions for a specific post by its ID from the database
//         const reactsArray = await React.find({ postRef: req.params.id });

//         // Create a new object 'newReacts' to group reactions by type
//         const newReacts = reactsArray.reduce((group, react) => {
//             // Get the type of the reaction
//             let key = react["react"];
//             // Initialize an array for this type if it doesn't exist
//             group[key] = group[key] || [];
//             // Push the reaction into the corresponding type array
//             group[key].push(react);
//             return group;
//         }, {});

/*
[
    {
        Love: [
    ,
    ]
    }

     Like: [
    
    ]
     Sad: [
    
    ]
     Angry: [
    
    ]
]  
        */

//         // Summarize the counts of each reaction type in an array 'reacts'
//         const reacts = [
//             {
//                 react: "like",
//                 count: newReacts.like ? newReacts.like.length : 0,
//             },
//             {
//                 react: "love",
//                 count: newReacts.love ? newReacts.love.length : 0,
//             },
//             {
//                 react: "haha",
//                 count: newReacts.haha ? newReacts.haha.length : 0,
//             },
//             {
//                 react: "sad",
//                 count: newReacts.sad ? newReacts.sad.length : 0,
//             },
//             {
//                 react: "wow",
//                 count: newReacts.wow ? newReacts.wow.length : 0,
//             },
//             {
//                 react: "angry",
//                 count: newReacts.angry ? newReacts.angry.length : 0,
//             },
//         ];

//         // Check if the current user has reacted to the post
//         const check = await React.findOne({
//             postRef: req.params.id,
//             reactBy: req.user.id,
//         });

//         // Send a JSON response to the client with reaction statistics
//         res.json({
//             reacts, // An array of reaction types and their counts
//             check: check?.react, // The type of reaction by the current user (if any)
//             total: reactsArray.length, // The total count of reactions for the post
//         });
//     } catch (error) {
//         // Handle errors by returning a 500 Internal Server Error response
//         return res.status(500).json({ message: error.message });
//     }
// };

exports.getReactions = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;

        // Fetch all reactions for the post
        const reactions = await React.find({ postRef: postId });

        // Group reactions by type and count them
        const reactionCounts = ["like", "love", "care", "haha", "sad", "wow", "angry"].map((type) => ({
            react: type,
            count: reactions.filter((r) => r.react === type).length,
        }));

        // Check if the current user has reacted to the post
        const userReaction = await React.findOne({ postRef: postId, reactBy: userId });

        const user = await User.findById(req.user.id);
        const checkSaved = user?.savedPosts.find((x) => x.post.toString() === req.params.id);

        // Send a JSON response with the reaction statistics
        res.json({
            reactions: reactionCounts,
            userReaction: userReaction?.react,
            total: reactions.length,
            checkSaved: checkSaved ? true : false,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
