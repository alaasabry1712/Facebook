// Importing necessary modules
const User = require("../models/User"); // User model

// Function to validate an email
exports.validateEmail = (email) => {
    // The String() method is used to convert the email to a string
    // The toLowerCase() method is used to convert the email to lowercase
    // This is done because email addresses are case-INsensitive, meaning 'EMAIL@DOMAIN.COM' is the same as 'email@domain.com'

    // The match() method is used to check if the email matches the regular expression
    // The regular expression checks if the email is in a valid format
    /* Here's what the regular expression means:
    ^([a-z\d\.-]+)@: Starts with one or more alphanumeric characters, dots or dashes followed by an @
    ([a-z\d-]+)\.: Followed by one or more alphanumeric characters or dashes followed by a dot
    ([a-z]{2,12})(\.[a-z]{2,12})?$: Ends with a domain that is 2 to 12 characters long, optionally followed by a dot and another 2 to 12 characters */
    return String(email)
        .toLowerCase()
        .match(/^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,12})(\.[a-z]{2,12})?$/);
};

// Function to validate the length of a text
exports.validateLength = (text, min, max) => {
    // If the length of the text is greater than the max or less than the min, return false
    // Otherwise, return true
    if (text.length > max || text.length < min) {
        return false;
    }
    return true;
};

// Function to validate a username
exports.validateUsername = async (username) => {
    let a = false;

    do {
        // Checking if the username already exists in the database
        let check = await User.findOne({ username });
        if (check) {
            // If the username exists, append a random number to the username
            // This is done to ensure the username is unique
            username += (+new Date() * Math.random()).toString().substring(0, 1);
            a = true;
        } else {
            a = false;
        }
    } while (a);
    return username;
};
