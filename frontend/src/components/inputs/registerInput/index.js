import "./style.css"; // Import CSS styles
import { useField, ErrorMessage } from "formik"; // Import Formik utility functions
import { useMediaQuery } from "react-responsive"; // Import media query hook

export default function RegisterInput({ placeholder, bottom, ...props }) {
    /*  This line uses Formik's useField hook to connect the input field with Formik's form state. It destructures field and meta from the result.
    1. field: This object contains properties like name, value, onChange, and onBlur, which are necessary for the input field to work with Formik.
    2. meta: This object contains information about the field's state, such as whether it has been touched, whether there's an error, and more. */
    const [field, meta] = useField(props); // Use Formik's useField to get field and meta info
    // Define three media queries for different screen sizes
    const view1 = useMediaQuery({
        query: "(min-width: 539px)",
    });
    // const view2 = useMediaQuery({
    //     query: "(min-width: 850px)",
    // });
    const view3 = useMediaQuery({
        query: "(min-width: 1170px)",
    });

    const test1 = view3 && field.name === "first_name"; // A condition with a screen width for the first name field
    const test2 = view3 && field.name === "last_name"; // Another condition with a screen width for the last name field

    return (
        <div className="input_wrap register_input_wrap">
            <input
                className={meta.touched && meta.error ? "input_error_border" : ""} // Add an error border class if the field is touched and has an error
                style={{
                    width: `${
                        view1 && (field.name === "first_name" || field.name === "last_name") // Dynamically set the width based on screen width and field name
                            ? "100%"
                            : view1 && (field.name === "email" || field.name === "password")
                            ? "370px"
                            : "300px"
                    }`,
                }}
                type={field.type} // Set the input field's type (e.g., text, password)
                name={field.name} // Set the input field's name
                placeholder={placeholder} // Set the input field's placeholder text
                /* This spreading means that each property and event handler in the field object is applied to the input element separately.*/
                {...field} // Spread the properties and event handlers from the "field" object
                {...props} // Spread any additional props that were passed to the component
            />
            {meta.touched &&
            meta.error && ( // Check if the field was touched and has an error
                    <div
                        className={view3 ? "input_error input_error_desktop" : "input_error"} // Apply different styles based on the "view3" media query result
                        style={{
                            transform: "translateY(2px)", // Adjust the vertical position with a 2px translation
                            left: `${test1 ? "-107%" : test2 ? "107%" : ""}`, // Adjust the horizontal position based on tests
                        }}
                    >
                        {
                            meta.touched && meta.error && (
                                <ErrorMessage name={field.name} />
                            ) /* Display the error message using Formik's ErrorMessage component */
                        }
                        {meta.touched &&
                        meta.error && ( // Check if the field was touched and has an error
                                <div
                                    className={
                                        view3 && field.name !== "last_name"
                                            ? "error_arrow_left"
                                            : view3 && field.name === "last_name"
                                            ? "error_arrow_right"
                                            : !view3 && "error_arrow_bottom"
                                    } /* Display an error arrow based on the "view3" media query and field name */
                                ></div>
                            )}
                    </div>
                )}
            {meta.touched && meta.error && <i className="error_icon"></i> /* Display an error icon */}
        </div>
    );
}
