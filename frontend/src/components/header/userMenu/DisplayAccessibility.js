import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";

export default function DisplayAccessibility({ setVisible }) {
    const dispatch = useDispatch(); // Access the Redux dispatch function.

    // Select the 'darkTheme' property from the Redux store.
    // 'darkTheme' indicates whether dark mode is enabled (true) or disabled (false).
    const { darkTheme } = useSelector((state) => ({ ...state }));

    return (
        <div className="absolute_wrap">
            <div className="absolute_wrap_header">
                <div
                    className="circle hover1"
                    onClick={() => {
                        setVisible(0); // Handle click event to navigate or close the interface
                    }}
                >
                    <i className="arrow_back_icon"></i> {/* Icon for navigating back */}
                </div>
                Display & Accessibility {/* Title for the header section */}
            </div>

            <div className="mmenu_main">
                <div className="small_circle" style={{ width: "50px" }}>
                    <i className="dark_filled_icon"></i> {/* Icon indicating dark mode */}
                </div>
                <div className="mmenu_col">
                    <span className="mmenu_span1">Dark Mode</span> {/* Title for dark mode setting */}
                    {/* Description of the dark mode setting */}
                    <span className="mmenu_span2">
                        Adjust the appearance of Facebook to reduce glare and give your eyes a break.
                    </span>
                </div>
            </div>

            <label
                htmlFor="darkOff" // Associates the label with the 'darkOff' input field
                className="hover1" // Adds a hover effect to the label
                onClick={() => {
                    Cookies.set("darkTheme", false); // Set darkTheme cookie to 'false' when clicked
                    dispatch({ type: "LIGHT" }); // Dispatches an action to set the theme to light mode
                }}
            >
                <span>Off</span> {/* Display the label "Off" */}
                {darkTheme ? ( // Conditionally render the radio input based on the current theme
                    <input type="radio" name="dark" id="darkOff" />
                ) : (
                    <input type="radio" name="dark" id="darkOff" checked /> // If darkTheme is false, the radio input is checked
                )}
            </label>

            <label
                htmlFor="darkOn" // Associates the label with the 'darkOn' input field
                className="hover1" // Adds a hover effect to the label
                onClick={() => {
                    Cookies.set("darkTheme", true); // Set darkTheme cookie to 'true' when clicked
                    dispatch({ type: "DARK" }); // Dispatches an action to set the theme to dark mode
                }}
            >
                <span>On</span> {/* Display the label "On" */}
                {darkTheme ? ( // Conditionally render the radio input based on the current theme
                    <input type="radio" name="dark" id="darkOn" checked /> // If darkTheme is true, the radio input is checked
                ) : (
                    <input type="radio" name="dark" id="darkOn" />
                )}
            </label>

            <div className="mmenu_main inactive-link">
                <div className="small_circle inactive-icon" style={{ width: "50px" }}>
                    <i className="compact_icon"></i> {/* Icon for the 'Compact mode' setting */}
                </div>
                <div className="mmenu_col inactive-link">
                    <span className="mmenu_span1 inactive-link">Compact mode</span> {/* Setting title: 'Compact mode' */}
                    <span className="mmenu_span2 inactive-link">
                        Make your font size smaller so more content can fit on the screen.
                    </span>{" "}
                    {/* Description of the 'Compact mode' setting */}
                </div>
            </div>

            <label htmlFor="compactOff" className=" inactive-link">
                {/* Label for the 'Off' option of 'Compact mode' */}
                <span className="inactive-link">Off</span> {/* Display the label "Off" */}
                <input type="radio" disabled name="compact" id="compactOff" /> {/* Radio input for turning 'Compact mode' off */}
            </label>

            <label htmlFor="compactOn" className=" inactive-link">
                {/* Label for the 'On' option of 'Compact mode' */}
                <span className="inactive-link">On</span> {/* Display the label "On" */}
                <input type="radio" disabled name="compact" id="compactOn" /> {/* Radio input for turning 'Compact mode' on */}
            </label>

            <div className="mmenu_item inactive-link">
                <div className="small_circle inactive-icon">
                    <i className="keyboard_icon"></i> {/* Icon for the 'Keyboard' setting */}
                </div>
                <span>Keyboard</span> {/* Setting title: 'Keyboard' */}
                <div className="rArrow inactive-icon">
                    <i className="right_icon"></i> {/* Icon indicating a right arrow for navigation */}
                </div>
            </div>
        </div>
    );
}
