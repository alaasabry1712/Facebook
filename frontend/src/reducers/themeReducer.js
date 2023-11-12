import Cookies from "js-cookie";

// This is a reducer function for managing the theme state.
// A reducer function takes the current state and an action, and returns the new state.
// The initial state is retrieved from a cookie. If the 'darkTheme' cookie exists, its value is parsed and used as the initial state. Otherwise, the initial state is false.
export function themeReducer(state = Cookies.get("darkTheme") ? JSON.parse(Cookies.get("darkTheme")) : false, action) {
    // The action has a 'type' property that determines how the state should be updated.
    switch (action.type) {
        // If the action type is 'DARK', it means the theme should be set to dark.
        // In this case, we return true.
        case "DARK":
            return true;

        // If the action type is 'LIGHT', it means the theme should be set to light.
        // In this case, we return false.
        case "LIGHT":
            return false;

        // If the action type doesn't match any of the above cases, we return the current state unchanged.
        default:
            return state;
    }
}
