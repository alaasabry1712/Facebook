const express = require("express"); // Express.js framework for building the server
const mongoose = require("mongoose"); // Mongoose for working with MongoDB
const cors = require("cors"); // CORS middleware for enabling cross-origin requests
const fileUpload = require("express-fileupload"); // Middleware for handling file uploads
const { readdirSync } = require("fs"); // Node.js filesystem module for reading directory contents
const dotenv = require("dotenv"); // Load environment variables from a .env file
dotenv.config(); // Load environment variables from .env file into process.env

// Create an instance of the Express application
const app = express();

// Configure Express middleware
app.use(express.json()); // Parse incoming JSON data
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS). (allwoing all domain for now)
app.use(
    fileUpload({
        useTempFiles: true, // Handle file uploads and store them as temporary files
    })
);

// Define routes by dynamically loading all the route files from the "routes" directory
readdirSync("./routes").map((r) => app.use("/", require("./routes/" + r)));


// Set the port for the server to listen on, using the specified port or defaulting to 8000
const PORT = process.env.PORT || 8000;
app.listen(8000, () => {
    console.log(`Server is running on port ${PORT}.`);
});
// Connect to the MongoDB database using Mongoose
mongoose
    .connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
    })
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.log("Error connecting to MongoDB", err));

// // Set the port for the server to listen on, using the specified port or defaulting to 8000
// const PORT = process.env.PORT || 8000;
// app.listen(8000, () => {
//     console.log(`Server is running on port ${PORT}.`);
// });
