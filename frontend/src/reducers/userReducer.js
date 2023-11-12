import Cookies from "js-cookie";

// Define a Redux user reducer to manage user-related state
export function userReducer(
    // The initial state is set to 'null' or derived from a cookie if available
    state = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null,
    action
) {
    switch (action.type) {
        // When a user logs in, update the user state with the provided data
        case "LOGIN":
            return action.payload;

        // When a user logs out, set the user state to 'null' indicating non-authenticated
        case "LOGOUT":
            return null;

        // Update the user's profile picture in the state with the new value
        case "UPDATEPICTURE":
            return { ...state, picture: action.payload };

        // Update the user's verification status in the state
        case "VERIFY":
            return { ...state, verified: action.payload };

        // For any other action type, return the current state unchanged
        default:
            return state;
    }
}
