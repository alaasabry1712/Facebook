const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema; // Destructuring ObjectId from the Mongoose Schema

// Define the schema for the "Code" collection
const codeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
    },
    user: {
        type: ObjectId,
        ref: "User", // References the "User" model
        required: true,
    },
});

// Create a Mongoose model named "Code" using the codeSchema
module.exports = mongoose.model("Code", codeSchema);
