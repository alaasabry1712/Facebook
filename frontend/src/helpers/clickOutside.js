import { useEffect } from "react";

/**
 * Custom hook for detecting clicks outside a reference element and triggering a callback function.
 * @param {React.RefObject} ref - Reference to the DOM element to detect clicks outside of.
 * @param {Function} fun - Callback function to execute when a click occurs outside the reference element.
 */
export default function useClickOutside(ref, fun) {
    useEffect(() => {
        // Define a function (listener) to handle click and touch events.
        const listener = (e) => {
            // Check if the reference element exists and the clicked element is not inside it.
            if (!ref.current || ref.current.contains(e.target)) {
                return; // Click is inside the reference element, so exit.
            }
            // Click is outside the reference element, so execute the provided callback function.
            fun();
        };

        // Add event listeners for "mousedown" (desktop) and "touchstart" (touch devices) on the document.
        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);

        // Cleanup: Remove event listeners when the component unmounts.
        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [ref, fun]);
}
