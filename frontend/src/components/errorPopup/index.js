import React, { useRef } from "react";
import { useSelector } from "react-redux";
import useClickOutside from "../../helpers/clickOutside";

// Initialize and define a React component for displaying error messages.
export default function ErrorPopup() {
    const errorPopup = useRef(null); // Create a reference to the error popup element.
    const { error } = useSelector((state) => ({ ...state })); // Use the useSelector hook from Redux to retrieve the 'error' object from the state.

    // Utilize the 'useClickOutside' hook to detect clicks outside the error popup, but without any specified action.
    useClickOutside(errorPopup, () => {});

    return (
        <div className="blur" id="errorPopup">
            {/* Apply a CSS class for blurring the background content. */}
            <div className="postBox" ref={errorPopup} id="erroPost1">
                {/* Create a postBox with a reference to the errorPopup element and an ID. */}
                <div className="box_header">
                    {/* Display a header for the error message. */}
                    <div className="small_circle">
                        <i className="exit_icon"></i>
                        {/* Display a small circle with an exit icon for closing the error popup. */}
                    </div>
                    <span>{error.header}</span>
                    {/* Display the error message header based on the 'error' object received from the state. */}
                </div>
                <div className="error_body">{error.error}</div>
                {/* Display the error message body based on the 'error' object received from the state. */}
            </div>
        </div>
    );
}
