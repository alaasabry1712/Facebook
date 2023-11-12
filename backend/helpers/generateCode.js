// Function to generate a random numeric code of a specified length.
// Parameters: length (number): The length of the code to be generated.
// Returns: (string): The randomly generated numeric code.
function generateCode(length) {
    // Initialize an empty string to store the generated code.
    let code = "";
    // Define the schema of characters used for code generation (0-9).
    let schema = "0123456789";

    // Generate the code in a loop of the specified length.
    for (let i = 0; i < length; i++) {
        // Generate a random index within the valid range of the schema string.
        // This line generates a random floating-point number between 0 (inclusive)
        // and 1 (exclusive) using Math.random(). By multiplying it by the length of the
        // schema (which is 10 characters), it ensures the result (of the index) falls within the range [0, 10).
        let randomFloat = Math.random() * schema.length;

        // Math.floor is used to round down the randomFloat to the nearest integer.
        // This effectively converts the floating-point number to an integer in the range [0, 9].
        let index = Math.floor(randomFloat);

        // Append the character at the random index to the code.
        code += schema.charAt(index);
    }

    // Return the generated code as a string.
    return code;
}

module.exports = generateCode;
