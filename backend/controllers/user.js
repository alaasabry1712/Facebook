const { validateEmail, validateLength, validateUsername } = require("../helpers/validation"); // Validation functions that we created
const User = require("../models/User"); // User model
const Code = require("../models/Code"); // Code model
const Post = require("../models/Post"); // Post model
const jwt = require("jsonwebtoken"); // JSON Web Token for creating tokens
const bcrypt = require("bcrypt"); // bcrypt for password hashing
const { generateToken } = require("../helpers/tokens"); // Function to generate tokens
const { sendVerificationEmail, sendResetCode } = require("../helpers/mailer"); // Functions to send verification email, and to send a password reset code
const generateCode = require("../helpers/generateCode"); // a simple function to generate a code for password resetting
const mongoose = require("mongoose"); //

// Register function
exports.register = async (req, res) => {
    try {
        // Destructuring request body to get user details
        const { first_name, last_name, email, password, username, bYear, bMonth, bDay, gender } = req.body;

        // Validating email
        if (!validateEmail(email)) {
            return res.status(400).json({
                message: "invalid email address",
            });
        }

        // Checking if the email already exists in the database
        const check = await User.findOne({ email });
        if (check) {
            return res.status(400).json({
                message: "This email address already exists, try with a different email address",
            });
        }

        // Validating first name, last name, and password length
        if (!validateLength(first_name, 3, 30) || !validateLength(last_name, 3, 30) || !validateLength(password, 6, 40)) {
            return res.status(400).json({
                message:
                    "first name, last name must be between 3 and 30 characters, and password must be at least 6 characters.",
            });
        }

        // Hashing the password
        const cryptedPassword = await bcrypt.hash(password, 12);

        // Creating a username from first name and last name
        let tempUsername = first_name + last_name;
        let newUsername = await validateUsername(tempUsername);

        // Creating a new user
        const user = await new User({
            first_name,
            last_name,
            email,
            password: cryptedPassword,
            username: newUsername,
            bYear,
            bMonth,
            bDay,
            gender,
        }).save();

        // Generating an email verification token
        const emailVerificationToken = generateToken({ id: user._id.toString() }, "1d");

        // Creating a verification URL
        const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;

        // Sending a verification email
        sendVerificationEmail(user.email, user.first_name, url);

        // Generating a token for the user
        const token = generateToken({ id: user._id.toString() }, "7d");

        // Sending a response with user details and token
        res.send({
            id: user._id,
            username: user.username,
            picture: user.picture,
            first_name: user.first_name,
            last_name: user.last_name,
            token: token,
            verified: user.verified,
            message: "Register Success! please activate your email to start",
        });
    } catch (error) {
        // Sending an error response
        res.status(500).json({ message: error.message });
    }
};

// Account activation function
exports.activateAccount = async (req, res) => {
    try {
        // Getting the token from the request body
        const { token } = req.body;

        // Verifying the token
        const user = jwt.verify(token, process.env.TOKEN_SECRET);

        // Checking if the user is already verified
        const check = await User.findById(user.id);
        if (check.verified == true) {
            return res.status(400).json({ message: "this email is already activated" });
        } else {
            // Updating the user's verified status
            await User.findByIdAndUpdate(user.id, { verified: true });

            // Sending a success response
            return res.status(200).json({ message: "Account has been activated successfully." });
        }
    } catch (error) {
        // Sending an error response
        res.status(500).json({ message: error.message });
    }
};

// Login function
exports.login = async (req, res) => {
    try {
        // Getting email and password from the request body
        const { email, password } = req.body;

        // Checking if the email exists in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "the email address you entered is not connected to an account.",
            });
        }

        // Checking if the password is correct
        const check = await bcrypt.compare(password, user.password);
        if (!check) {
            return res.status(400).json({
                message: "Invalid credentials. Please try again.",
            });
        }

        // Generating a token for the user
        const token = generateToken({ id: user._id.toString() }, "7d");

        // Sending a response with user details and token
        res.send({
            id: user._id,
            username: user.username,
            picture: user.picture,
            first_name: user.first_name,
            last_name: user.last_name,
            token: token,
            verified: user.verified,
        });
    } catch (error) {
        // Sending an error response
        res.status(500).json({ message: error.message });
    }
};

// Send an email verification link to the user
exports.sendVerification = async (req, res) => {
    try {
        const id = req.user.id;
        const user = await User.findById(id);

        // Check if the account is already verified
        if (user.verified === true) {
            return res.status(400).json({
                message: "This account is already activated.",
            });
        }

        // Generate an email verification token and construct the verification URL
        const emailVerificationToken = generateToken({ id: user._id.toString() }, "1d");
        const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;

        // Send the verification email
        sendVerificationEmail(user.email, user.first_name, url);

        return res.status(200).json({
            message: "Email verification link has been sent to your email.",
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: error.message });
    }
};

// Find a user based on their email
exports.findUser = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email }).select("-password");
        /* //? .select("-password") This part specifies that you want to retrieve the user object from the database,
        but you want to exclude the password field.
        This is a common security practice, as you usually don't want to send a user's password in responses to clients. So,
        it only selects all fields except the password. */

        // Check if the user exists
        if (!user) {
            return res.status(400).json({
                message: "Account does not exist.",
            });
        }

        return res.status(200).json({
            email: user.email,
            picture: user.picture,
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: error.message });
    }
};

// Send a reset code to the user's email
exports.sendResetPasswordCode = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email }).select("-password");

        // Remove any existing reset codes for the user
        await Code.findOneAndRemove({ user: user._id });

        // Generate a reset code and save it
        const code = generateCode(5);
        const savedCode = await new Code({
            code,
            user: user._id,
        }).save();

        // Send the reset code to the user's email
        sendResetCode(user.email, user.first_name, code);

        return res.status(200).json({
            message: "Reset code has been sent to your email",
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: error.message });
    }
};

// Validate the reset code provided by the user
exports.validateResetCode = async (req, res) => {
    try {
        const { email, code } = req.body;
        const user = await User.findOne({ email });
        const Dbcode = await Code.findOne({ user: user._id });

        // Check if the provided code matches the stored code in the database
        if (Dbcode.code !== code) {
            return res.status(400).json({
                message: "Wrong verification code.",
            });
        }

        return res.status(200).json({ message: "ok" });
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: error.message });
    }
};

// Change the user's password
exports.changePassword = async (req, res) => {
    const { email, password } = req.body;

    // Hash the new password
    const cryptedPassword = await bcrypt.hash(password, 12);

    // Update the user's password in the database
    await User.findOneAndUpdate(
        { email },
        {
            password: cryptedPassword,
        }
    );

    return res.status(200).json({ message: "ok" });
};

// Retrieves the profile information, posts, and friendship status for a specific user.
exports.getProfile = async (req, res) => {
    try {
        const { username } = req.params; // Extract the 'username' parameter from the request.
        const user = await User.findById(req.user.id); // Find the user based on the currently authenticated user's ID.
        const profile = await User.findOne({ username }).select("-password"); // Find the profile of the user with the provided 'username' and exclude the 'password' field.

        // Create a 'friendship' object to represent the friendship status between the current user and the profile user.
        const friendship = {
            friends: false,
            following: false,
            requestSent: false,
            requestReceived: false,
        };

        // Check if the profile exists; if not, return an error response.
        if (!profile) {
            return res.json({ ok: false });
        }

        // Check if the current user and profile user are friends.
        if (user.friends.includes(profile._id) && profile.friends.includes(user._id)) {
            friendship.friends = true;
        }

        // Check if the current user is following the profile user.
        if (user.following.includes(profile._id)) {
            friendship.following = true;
        }

        // Check if the current user has sent a friend request to the profile user.
        if (user.requests.includes(profile._id)) {
            friendship.requestReceived = true;
        }

        // Check if the profile user has sent a friend request to the current user.
        if (profile.requests.includes(user._id)) {
            friendship.requestSent = true;
        }

        // Find and populate posts by the profile user, sorted by creation date.
        const posts = await Post.find({ user: profile._id })
            .populate("user") // Populate the 'user' field in posts to get user details
            .populate("comments.commentBy", "first_name last_name picture username commentAt")
            // Populate the 'comments.commentBy' field in posts to get details of comment authors
            .sort({ createdAt: -1 }); // Sort the posts in descending order by their 'createdAt' timestamps

        // Populate the profile user's friends with selected fields.
        await profile.populate("friends", "first_name last_name username picture");

        // Send a JSON response containing the profile information, posts, and friendship status.
        res.json({ ...profile.toObject(), posts, friendship });
    } catch (error) {
        // Send a JSON response indicating an internal server error.
        res.status(500).json({ message: error.message });
    }
};

exports.updateProfilePicture = async (req, res) => {
    try {
        // Get the URL of the new profile picture from the request body
        const { url } = req.body;

        // Update the user's profile picture in the database by finding the user using their ID and setting the 'picture' field to the new URL
        await User.findByIdAndUpdate(req.user.id, {
            picture: url,
        });

        // Respond with the updated URL of the profile picture
        res.json(url);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCover = async (req, res) => {
    try {
        // Extract the URL of the new cover photo from the request's body
        const { url } = req.body;

        // Update the user's cover photo by finding their user record by ID and setting the 'cover' field to the new URL
        await User.findByIdAndUpdate(req.user.id, {
            cover: url,
        });

        // Respond with the updated URL of the user's cover photo
        res.json(url);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateDetails = async (req, res) => {
    try {
        // Extract the user's updated information from the request body
        const { info } = req.body;

        // Update the user's details by finding their user record by ID and setting the 'details' field to the new information
        const updated = await User.findByIdAndUpdate(
            req.user.id,
            {
                details: info,
            },
            // The "new: true" option is used to instruct Mongoose to return the modified document rather than the original document.
            {
                new: true,
            }
        );

        // Respond with the updated user details
        res.json(updated.details);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Function to handle Sending a friend request to another user with the specified 'id'.
exports.addFriend = async (req, res) => {
    try {
        // Check if the sender's user ID matches the 'id' parameter in the request.
        if (req.user.id !== req.params.id) {
            // Retrieve the sender and receiver users from the database.
            const sender = await User.findById(req.user.id);
            const receiver = await User.findById(req.params.id);

            // Check if the sender has not already sent a request and is not already friends with the receiver.
            if (!receiver.requests.includes(sender._id) && !receiver.friends.includes(sender._id)) {
                // Update the receiver's profile to include the sender's ID in their list of requests.
                await receiver.updateOne({
                    $push: { requests: sender._id },
                });

                // Update the receiver's profile to include the sender's ID in their list of followers.
                await receiver.updateOne({
                    $push: { followers: sender._id },
                });

                // Update the sender's profile to include the receiver's ID in their list of following.
                await sender.updateOne({
                    $push: { following: receiver._id },
                });

                // Send a JSON response indicating that the friend request has been sent.
                res.json({ message: "Friend request has been sent" });
            } else {
                // Send a JSON response indicating that a request has already been sent.
                return res.status(400).json({ message: "Friend request already sent" });
            }
        } else {
            // Send a JSON response indicating that a user can't send a request to themselves.
            return res.status(400).json({ message: "You can't send a request to yourself" });
        }
    } catch (error) {
        // Send a JSON response indicating an internal server error.
        res.status(500).json({ message: error.message });
    }
};

// Function to handle canceling a friend request that was previously sent to another user with the specified 'id'.
exports.cancelRequest = async (req, res) => {
    try {
        // Check if the sender's user ID matches the 'id' parameter in the request.
        if (req.user.id !== req.params.id) {
            // Retrieve the sender and receiver users from the database.
            const sender = await User.findById(req.user.id);
            const receiver = await User.findById(req.params.id);

            // Check if the receiver has a pending friend request from the sender and is not already friends.
            if (receiver.requests.includes(sender._id) && !receiver.friends.includes(sender._id)) {
                // Update the receiver's profile to remove the sender's ID from their list of requests.
                await receiver.updateOne({
                    $pull: { requests: sender._id },
                });

                // Update the receiver's profile to remove the sender's ID from their list of followers.
                await receiver.updateOne({
                    $pull: { followers: sender._id },
                });

                // Update the sender's profile to remove the receiver's ID from their list of following.
                await sender.updateOne({
                    $pull: { following: receiver._id },
                });

                // Send a JSON response indicating that the request has been successfully canceled.
                res.json({ message: "You have successfully canceled the request" });
            } else {
                // Send a JSON response indicating that the request has already been canceled.
                return res.status(400).json({ message: "Request has already been canceled" });
            }
        } else {
            // Send a JSON response indicating that a user can't cancel a request to themselves.
            return res.status(400).json({ message: "You can't cancel a request to yourself" });
        }
    } catch (error) {
        // Send a JSON response indicating an internal server error.
        res.status(500).json({ message: error.message });
    }
};

// Allows the current user to follow another user with the specified 'id'.
exports.follow = async (req, res) => {
    try {
        // Check if the sender's user ID matches the 'id' parameter in the request.
        if (req.user.id !== req.params.id) {
            // Retrieve the sender and receiver users from the database.
            const sender = await User.findById(req.user.id);
            const receiver = await User.findById(req.params.id);

            // Check if the sender is not already a follower of the receiver and not already following them.
            if (!receiver.followers.includes(sender._id) && !sender.following.includes(receiver._id)) {
                // Update the receiver's profile to add the sender's ID to their list of followers.
                await receiver.updateOne({
                    $push: { followers: sender._id },
                });

                // Update the sender's profile to add the receiver's ID to their list of following.
                await sender.updateOne({
                    $push: { following: receiver._id },
                });

                // Send a JSON response indicating that the follow operation was successful.
                res.json({ message: "You are now following the user" });
            } else {
                // Send a JSON response indicating that the sender is already following the receiver.
                return res.status(400).json({ message: "You are already following this user" });
            }
        } else {
            // Send a JSON response indicating that a user can't follow themselves.
            return res.status(400).json({ message: "You can't follow yourself" });
        }
    } catch (error) {
        // Send a JSON response indicating an internal server error.
        res.status(500).json({ message: error.message });
    }
};

// Allows the current user to unfollow another user with the specified 'id'.
exports.unfollow = async (req, res) => {
    try {
        // Check if the sender's user ID matches the 'id' parameter in the request.
        if (req.user.id !== req.params.id) {
            // Retrieve the sender and receiver users from the database.
            const sender = await User.findById(req.user.id);
            const receiver = await User.findById(req.params.id);

            // Check if the sender is already a follower of the receiver and is following them.
            if (receiver.followers.includes(sender._id) && sender.following.includes(receiver._id)) {
                // Update the receiver's profile to remove the sender's ID from their list of followers.
                await receiver.updateOne({
                    $pull: { followers: sender._id },
                });

                // Update the sender's profile to remove the receiver's ID from their list of following.
                await sender.updateOne({
                    $pull: { following: receiver._id },
                });

                // Send a JSON response indicating that the unfollow operation was successful.
                res.json({ message: "You have unfollowed the user" });
            } else {
                // Send a JSON response indicating that the sender is already not following the receiver.
                return res.status(400).json({ message: "You are already not following this user" });
            }
        } else {
            // Send a JSON response indicating that a user can't unfollow themselves.
            return res.status(400).json({ message: "You can't unfollow yourself" });
        }
    } catch (error) {
        // Send a JSON response indicating an internal server error.
        res.status(500).json({ message: error.message });
    }
};

// Allows the current user to accept a friend request from another user with the specified 'id'.
exports.acceptRequest = async (req, res) => {
    try {
        // Check if the sender's user ID matches the 'id' parameter in the request.
        if (req.user.id !== req.params.id) {
            // Retrieve the receiver and sender users from the database.
            const receiver = await User.findById(req.user.id);
            const sender = await User.findById(req.params.id);

            // Check if the receiver has a friend request from the sender.
            if (receiver.requests.includes(sender._id)) {
                // Update the receiver's profile to add the sender's ID to their list of friends and following.
                await receiver.update({
                    $push: { friends: sender._id, following: sender._id },
                });

                // Update the sender's profile to add the receiver's ID to their list of friends and followers.
                await sender.update({
                    $push: { friends: receiver._id, followers: receiver._id },
                });

                // Update the receiver's profile to remove the sender's ID from their list of requests.
                await receiver.updateOne({
                    $pull: { requests: sender._id },
                });

                // Send a JSON response indicating that the friend request has been accepted.
                res.json({ message: "Friend request has been accepted" });
            } else {
                // Send a JSON response indicating that the sender is already a friend.
                return res.status(400).json({ message: "You are already friends with this user" });
            }
        } else {
            // Send a JSON response indicating that a user can't accept a request from themselves.
            return res.status(400).json({ message: "You can't accept a request from yourself" });
        }
    } catch (error) {
        // Send a JSON response indicating an internal server error.
        res.status(500).json({ message: error.message });
    }
};

// Allows the current user to unfriend another user with the specified 'id'.
exports.unfriend = async (req, res) => {
    try {
        // Check if the sender's user ID matches the 'id' parameter in the request.
        if (req.user.id !== req.params.id) {
            // Retrieve the sender and receiver users from the database.
            const sender = await User.findById(req.user.id);
            const receiver = await User.findById(req.params.id);

            // Check if the receiver is already a friend of the sender and the sender is a friend of the receiver.
            if (receiver.friends.includes(sender._id) && sender.friends.includes(receiver._id)) {
                // Update the receiver's profile to remove the sender's ID from their friends, following, and followers.
                await receiver.update({
                    $pull: {
                        friends: sender._id,
                        following: sender._id,
                        followers: sender._id,
                    },
                });

                // Update the sender's profile to remove the receiver's ID from their friends, following, and followers.
                await sender.update({
                    $pull: {
                        friends: receiver._id,
                        following: receiver._id,
                        followers: receiver._id,
                    },
                });

                // Send a JSON response indicating that the unfriend operation was successful.
                res.json({ message: "Unfriend request accepted" });
            } else {
                // Send a JSON response indicating that the sender is already not friends with the receiver.
                return res.status(400).json({ message: "You are already not friends with this user" });
            }
        } else {
            // Send a JSON response indicating that a user can't unfriend themselves.
            return res.status(400).json({ message: "You can't unfriend yourself" });
        }
    } catch (error) {
        // Send a JSON response indicating an internal server error.
        res.status(500).json({ message: error.message });
    }
};

// Allows the current user to delete a friend request from another user with the specified 'id'.
exports.deleteRequest = async (req, res) => {
    try {
        // Check if the sender's user ID matches the 'id' parameter in the request.
        if (req.user.id !== req.params.id) {
            // Retrieve the receiver and sender users from the database.
            const receiver = await User.findById(req.user.id);
            const sender = await User.findById(req.params.id);

            // Check if the receiver has a friend request from the sender.
            if (receiver.requests.includes(sender._id)) {
                // Update the receiver's profile to remove the sender's ID from their requests and followers.
                await receiver.update({
                    $pull: {
                        requests: sender._id,
                        followers: sender._id,
                    },
                });

                // Update the sender's profile to remove the receiver's ID from their following.
                await sender.update({
                    $pull: {
                        following: receiver._id,
                    },
                });

                // Send a JSON response indicating that the friend request has been deleted.
                res.json({ message: "Friend request has been deleted" });
            } else {
                // Send a JSON response indicating that the request has already been deleted.
                return res.status(400).json({ message: "The request has already been deleted" });
            }
        } else {
            // Send a JSON response indicating that a user can't delete a request from themselves.
            return res.status(400).json({ message: "You can't delete a request from yourself" });
        }
    } catch (error) {
        // Send a JSON response indicating an internal server error.
        res.status(500).json({ message: error.message });
    }
};

// Handles the search operation by querying the database for users matching the search term.
exports.search = async (req, res) => {
    try {
        const searchTerm = req.params.searchTerm;
        // Use the $text operator for text-based search in the MongoDB database.
        const results = await User.find({ $text: { $search: searchTerm } }).select("first_name last_name username picture");
        // Respond with the search results, which include user information.
        res.json(results);
    } catch (error) {
        // Handle errors and respond with an error message.
        res.status(500).json({ message: error.message });
    }
};

// Handles adding a new search history entry with the specified searchUser and creation timestamp.
exports.addToSearchHistory = async (req, res) => {
    try {
        // Retrieve the searchUser from the request body.
        const { searchUser } = req.body;

        // Find the user's document by their ID.
        const user = await User.findById(req.user.id);

        // Check if an entry with the same user already exists in the user's search history.
        const existingSearch = user.search.find((x) => x.user.toString() === searchUser);

        if (existingSearch) {
            // If an entry already exists, update its createdAt timestamp with the current time.
            await User.updateOne(
                {
                    _id: req.user.id,
                    "search._id": existingSearch._id,
                },
                {
                    $set: { "search.$.createdAt": new Date() },
                }
            );
        } else {
            // If no entry exists, push the new search history entry to the user's search history array.
            const newSearch = {
                user: searchUser,
                createdAt: new Date(),
            };

            await User.findByIdAndUpdate(req.user.id, {
                $push: { search: newSearch },
            });
        }
    } catch (error) {
        // Handle errors and respond with an error message.
        res.status(500).json({ message: error.message });
    }
};

// Handles getting a user's search history.
exports.getSearchHistory = async (req, res) => {
    try {
        // Find the user's document by their ID and select the 'search' field.
        // Populate the 'user' field in each search history entry with the actual user data from the User collection in the database.
        const user = await User.findById(req.user.id)
            .select("search")
            .populate("search.user", "first_name last_name username picture");

        // Send the user's search history as the response.
        res.json(user.search);
    } catch (error) {
        // Handle errors and respond with an error message.
        res.status(500).json({ message: error.message });
    }
};

// Handles removing a user's search history entry.
exports.removeFromSearch = async (req, res) => {
    try {
        // Retrieve the searchUser from the request body.
        const { searchUser } = req.body;

        // Find the user's document by their ID and remove the search history entry with the specified searchUser.
        await User.updateOne({ _id: req.user.id }, { $pull: { search: { user: searchUser } } });
    } catch (error) {
        // Handle errors and respond with an error message.
        res.status(500).json({ message: error.message });
    }
};

// This is a route handler function for getting a user's friends and friend requests.
exports.getFriendsPageinfo = async (req, res) => {
    try {
        // We want to populate certain fields in the user document that we retrieve from the database.
        // We define them in a variable here for clarity and reusability.
        const populateFields = "first_name last_name picture username";

        // We use the 'findById' function from Mongoose to find a user document in the database by ID.
        // We only select the 'friends' and 'requests' fields in the user document.
        // We then populate the 'friends' and 'requests' fields, which are references to other documents,
        // with actual data from those documents. The data we want are defined in 'populateFields'.
        const user = await User.findById(req.user.id)
            .select("friends requests")
            .populate("friends", populateFields)
            .populate("requests", populateFields);

        // We find all user documents where the current user's ID is in their 'requests' field.
        // This means that the current user has sent friend requests to these users.
        // We only select the fields defined in 'populateFields' in these user documents.
        const sentRequests = await User.find({
            requests: mongoose.Types.ObjectId(req.user.id),
        }).select(populateFields);

        // We send a response back to the client with the user's friends, friend requests, and sent requests in json format.
        res.json({
            friends: user.friends,
            requests: user.requests,
            sentRequests,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller function to get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); // Use Mongoose to retrieve all users from the database
        res.json(users); // Send the list of users as a JSON response
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Controller function to get user data by ID
exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).select("username"); // Select the username field
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Controller function to delete a user
exports.deleteUser = async (req, res) => {
    try {
        // Get the user ID from the request parameters
        const { userId } = req.params;

        // Remove the user by ID from the database
        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: "User removed successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get all posts with comments populated
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate("user", "username").populate({
            path: "comments.commentBy",
            model: "User",
            select: "username",
        });

        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Delete a post
exports.deletePost = async (req, res) => {
    const postId = req.params.postId;
    try {
        await Post.findByIdAndRemove(postId);
        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Delete a comment on a post
exports.deleteComment = async (req, res) => {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    try {
        await Post.findByIdAndUpdate(postId, { $pull: { comments: { _id: commentId } } });
        res.json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
