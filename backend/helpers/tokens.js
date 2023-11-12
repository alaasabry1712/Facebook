// Importing necessary modules
const jwt = require("jsonwebtoken"); // JSON Web Token for creating tokens

// Function to generate a token
exports.generateToken = (payload, expired) => {
    // The jwt.sign() method is used to create a new token
    // The first argument is the payload, which represents the data that will be included in the token
    // The second argument is the secret key, which is used to sign the token
    // The third argument is an options object where we can specify the token's expiration time
    return jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: expired,
    });
};
