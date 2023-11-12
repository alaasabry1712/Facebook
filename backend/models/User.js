const mongoose = require("mongoose"); // Mongoose for MongoDB interactions

// Destructuring ObjectId type from mongoose.shcema
const { ObjectId } = mongoose.Schema;

// Defining the user schema
const userSchema = mongoose.Schema(
    {
        // Defining the properties of the user
        first_name: {
            type: String, // The type of this property is string
            required: [true, "first name is required"], // This property is required
            trim: true, // Remove whitespace from both ends of the string
            text: true, // This property creates a text index on that field, which allows you to perform text search queries to find documents that contain a specific word or phrase.
        },
        last_name: {
            type: String,
            required: [true, "last name is required"],
            trim: true,
            text: true,
        },
        username: {
            type: String,
            required: [true, "username is required"],
            trim: true,
            text: true,
            unique: true, // This property must be unique
        },
        email: {
            type: String,
            required: [true, "email is required"],
            trim: true,
        },
        password: {
            type: String,
            required: [true, "password is required"],
        },
        picture: {
            type: String,
            trim: true,
            default: "https://res.cloudinary.com/dmhcnhtng/image/upload/v1643044376/avatars/default_pic_jeaybr.png", // Default value if none is provided
        },
        cover: {
            type: String,
            trim: true,
        },
        gender: {
            type: String,
            required: [true, "gender is required"],
            trim: true,
        },
        bYear: {
            type: Number,
            required: true,
            trim: true,
        },
        bMonth: {
            type: Number,
            required: true,
            trim: true,
        },
        bDay: {
            type: Number,
            required: true,
            trim: true,
        },
        verified: {
            type: Boolean,
            default: false, // Default value is false
        },
        // Each property in the friends array is a refrence to a user's ObjectId
        friends: [
            {
                type: ObjectId,
                ref: "User",
            },
        ],
        following: [
            {
                type: ObjectId,
                ref: "User",
            },
        ],
        followers: [
            {
                type: ObjectId,
                ref: "User",
            },
        ],
        requests: [
            {
                type: ObjectId,
                ref: "User",
            },
        ],
        search: [
            {
                user: {
                    type: ObjectId,
                    ref: "User",
                    required: true,
                },
                createdAt: {
                    type: Date,
                    required: true,
                },
            },
        ],
        details: {
            // More detailed user information
            bio: {
                type: String,
            },
            otherName: {
                type: String,
            },
            job: {
                type: String,
            },
            workplace: {
                type: String,
            },
            highSchool: {
                type: String,
            },
            college: {
                type: String,
            },
            currentCity: {
                type: String,
            },
            hometown: {
                type: String,
            },
            relationship: {
                type: String,
                enum: ["Single", "In a relationship", "Married", "Divorced"], // The value of this property must be one of these options
            },
            instagram: {
                type: String,
            },
        },
        savedPosts: [
            {
                post: {
                    type: ObjectId,
                    ref: "Post",
                },
                savedAt: {
                    type: Date,
                    required: true,
                },
            },
        ],
    },
    {
        timestamps: true, // Enable automatic timestamps for createdAt and updatedAt
    }
);

// Exporting the User model
module.exports = mongoose.model("User", userSchema);
