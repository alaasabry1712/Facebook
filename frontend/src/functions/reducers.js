// Reducer for managing state related to posts
export function postsReducer(state, action) {
    switch (action.type) {
        case "POSTS_REQUEST":
            // When a request is initiated, set loading to true and clear any errors
            return { ...state, loading: true, error: "" };
        case "POSTS_SUCCESS":
            // When a request is successful, update the state with posts, set loading to false, and clear errors
            return {
                ...state,
                loading: false,
                posts: action.payload,
                error: "",
            };
        case "POSTS_ERROR":
            // When there's an error, set loading to false and store the error message
            return { ...state, loading: false, error: action.payload };

        default:
            // Return the current state by default
            return state;
    }
}

// Reducer for managing state related to user profiles
export function profileReducer(state, action) {
    switch (action.type) {
        case "PROFILE_REQUEST":
            // When a "PROFILE_REQUEST" action is dispatched, update the state to indicate loading with an empty error.
            return { ...state, loading: true, error: "" };

        case "PROFILE_SUCCESS":
            // When a "PROFILE_SUCCESS" action is dispatched, update the state with the retrieved profile data and clear any error.
            return {
                ...state,
                loading: false,
                profile: action.payload,
                error: "",
            };

        case "PROFILE_POSTS":
            // When a "PROFILE_POSTS" action is dispatched, update the state with new profile posts and clear any error.
            return {
                loading: false,
                profile: { ...state.profile, posts: action.payload },
                error: "",
            };

        case "PROFILE_ERROR":
            // When a "PROFILE_ERROR" action is dispatched, update the state to indicate loading has finished and store the error message.
            return { ...state, loading: false, error: action.payload };

        default:
            // For any other unhandled actions, return the current state without any changes.
            return state;
    }
}

// Reducer for managing state related to photos
export function photosReducer(state, action) {
    switch (action.type) {
        case "PHOTOS_REQUEST":
            // When a request for photos is initiated, set loading to true and clear any errors
            return { ...state, loading: true, error: "" };
        case "PHOTOS_SUCCESS":
            // When a request for photos is successful, update the state with photo data, set loading to false, and clear errors
            return {
                ...state,
                loading: false,
                photos: action.payload,
                error: "",
            };
        case "PHOTOS_ERROR":
            // When there's an error in photo-related actions, set loading to false and store the error message
            return { ...state, loading: false, error: action.payload };

        default:
            // Return the current state by default
            return state;
    }
}

// This is a reducer function for managing the state of the friends page.
// A reducer function takes the current state and an action, and returns the new state.
export function friendspage(state, action) {
    // The action has a 'type' property that determines how the state should be updated.
    switch (action.type) {
        // If the action type is 'FRIENDS_REQUEST', it means a request to fetch data has been made.
        // In this case, we set 'loading' to true and 'error' to an empty string.
        case "FRIENDS_REQUEST":
            return { ...state, loading: true, error: "" };

        // If the action type is 'FRIENDS_SUCCESS', it means the data has been successfully fetched.
        // In this case, we set 'loading' to false, 'data' to the fetched data, and 'error' to an empty string.
        case "FRIENDS_SUCCESS":
            return {
                ...state,
                loading: false,
                data: action.payload,
                error: "",
            };

        // If the action type is 'FRIENDS_ERROR', it means an error occurred while fetching the data.
        // In this case, we set 'loading' to false and 'error' to the error message.
        case "FRIENDS_ERROR":
            return { ...state, loading: false, error: action.payload };

        // If the action type doesn't match any of the above cases, we return the current state unchanged.
        default:
            return state;
    }
}
