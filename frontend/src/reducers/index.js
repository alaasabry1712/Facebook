// Import the 'combineReducers' function from Redux.
// This function is used to combine multiple reducer functions into a single reducer function.
import { combineReducers } from "redux";

// Import the 'themeReducer' and 'userReducer' functions.
// These are reducer functions for managing the theme and user states, respectively.
import { themeReducer } from "./themeReducer";
import { userReducer } from "./userReducer";

// Use the 'combineReducers' function to combine 'themeReducer' and 'userReducer' into a single reducer function.
// The resulting reducer function, 'rootReducer', manages an object that contains the theme and user states.
// The keys of this object ('user' and 'darkTheme') are the names of the slices of state managed by 'userReducer' and 'themeReducer', respectively.
const rootReducer = combineReducers({
    user: userReducer,
    darkTheme: themeReducer,
});

export default rootReducer;
