const jwt = require("jsonwebtoken");

// Middleware function for user authentication
exports.authUser = async (req, res, next) => {
    try {
        // Get the Authorization header from the request header
        let tmp = req.header("Authorization");

        // Extract the token from the Authorization header if found
        /* The conditional statement checks whether tmp has a value. 
        If it does, it uses the slice method to extract the token portion from the header.
        The slice(7, tmp.length) part is used to remove the "Bearer " prefix, 
        which is commonly used with JWT (JSON Web Token) authentication. */
        const token = tmp ? tmp.slice(7, tmp.length) : "";

        // If no token is provided, return an error response
        if (!token) {
            return res.status(400).json({ message: "Invalid Authentication" });
        }

        // Verify the token using the secret key (process.env.TOKEN_SECRET)
        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            // If there's an error during token verification (for example the token is invalid), return an error response
            if (err) {
                return res.status(400).json({ message: "Invalid Authentication" });
            }

            // If the token is successfully verified, set the user object in the request
            req.user = user;

            // Continue processing the request by calling the next middleware or route handler
            next();
        });
    } catch (error) {
        // Handle any unexpected errors and return a 500 status code with an error message
        return res.status(500).json({ message: error.message });
    }
};
