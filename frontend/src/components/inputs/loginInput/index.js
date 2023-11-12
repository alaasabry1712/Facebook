import "./style.css"; // Import CSS styles
import { useField, ErrorMessage } from "formik"; // Import Formik utility functions
import { useMediaQuery } from "react-responsive"; // Import media query hook

// Define the LoginInput component
export default function LoginInput({ placeholder, bottom, ...props }) {
    /*  This line uses Formik's useField hook to connect the input field with Formik's form state. It destructures field and meta from the result.
    1. field: This object contains properties like name, value, onChange, and onBlur, which are necessary for the input field to work with Formik.
    2. meta: This object contains information about the field's state, such as whether it has been touched, whether there's an error, and more. */
    const [field, meta] = useField(props); // Use Formik's useField to get field and meta info
    // Define three media queries for different screen sizes
    // const view1 = useMediaQuery({
    //     query: "(min-width: 539px)",
    // });
    const view2 = useMediaQuery({
        query: "(min-width: 850px)",
    });
    // const view3 = useMediaQuery({
    //     query: "(min-width: 1170px)",
    // });

    // Here's what this component does:
    // The LoginInput component renders an input field with enhanced error handling and styling.
    // It uses Formik's useField to manage the form field's state and errors.
    // The useMediaQuery hook checks if the screen width matches the condition for desktop view.
    // Conditional rendering is applied based on whether the field has been touched and if there's an error.
    // It displays error messages, error arrows, and applies specific styling for desktop view when errors are present.
    // An error icon is also displayed at the appropriate position based on the view and the bottom prop.

    return (
        <div className="input_wrap">
            {meta.touched &&
            meta.error &&
            !bottom && ( // Check if the field was touched and has an error, and if it's not for the "bottom" scenario
                    <div
                        className={view2 ? "input_error input_error_desktop" : "input_error"} // Apply different styles based on the "view2" media query result
                        style={{ transform: "translateY(3px)" }} // Adjust the vertical position with a 3px translation
                    >
                        {meta.touched && meta.error && <ErrorMessage name={field.name} />}{" "}
                        {/* Display the error message using Formik's ErrorMessage component */}
                        {
                            meta.touched && meta.error && (
                                <div className={view2 ? "error_arrow_left" : "error_arrow_top"}></div>
                            ) /* Display an error arrow based on the "view2" media query */
                        }
                    </div>
                )}
            <input
                className={meta.touched && meta.error ? "input_error_border" : ""} // Add a class to the input field for an error border if the field is touched and has an error
                type={field.type} // Set the input field's type (e.g., text, password)
                name={field.name} // Set the input field's name
                placeholder={placeholder} // Set the input field's placeholder text
                /* This spreading means that each property and event handler in the field object is applied to the input element separately.
                For example, if the field object has a name property, it will be applied as the name attribute of the input element. */
                {...field} // Spread the properties and event handlers from the "field" object
                {...props} // Spread any additional props that were passed to the component
            />
            {meta.touched &&
            meta.error &&
            bottom && ( // Check if the field was touched, has an error, and it's for the "bottom" scenario
                    <div
                        className={view2 ? "input_error input_error_desktop" : "input_error"} // Apply different styles based on the "view2" media query result
                        style={{ transform: "translateY(2px)" }} // Adjust the vertical position with a 2px translation
                    >
                        {meta.touched && meta.error && <ErrorMessage name={field.name} />}{" "}
                        {/* Display the error message using Formik's ErrorMessage component */}
                        {meta.touched && meta.error && (
                            <div className={view2 ? "error_arrow_left" : "error_arrow_bottom"}></div> // Display an error arrow based on the "view2" media query for the "bottom" scenario
                        )}
                    </div>
                )}
            {meta.touched && meta.error && (
                <i className="error_icon" style={{ top: `${!bottom && !view2 ? "63%" : "15px"}` }}></i>
            )}
        </div>
    );
}
