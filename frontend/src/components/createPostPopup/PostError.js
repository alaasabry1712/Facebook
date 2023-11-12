import React from "react";

export default function PostError({ error, setError }) {
    return (
        <div className="postError">
            {/* Display the error message received as a prop. */}
            <div className="postError_error">{error}</div>
            {/* A button labeled "Try again" that, when clicked, clears the error message. */}
            <button
                className="blue_btn"
                onClick={() => {
                    setError(""); // Clicking this button calls the 'setError' function to clear the error.
                }}
            >
                Try again
            </button>
        </div>
    );
}
