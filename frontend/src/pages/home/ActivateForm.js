import PropagateLoader from "react-spinners/PropagateLoader";

/*
  The ActivateForm component is responsible for displaying a notification or message with optional loading indicator.
  @param {string} type - The type of the message, can be "success" or "error".
  @param {string} header - The header or title of the message.
  @param {string} text - The main content or text of the message.
  @param {boolean} loading - A flag to indicate whether a loading indicator should be displayed.
 */
export default function ActivateForm({ type, header, text, loading }) {
    return (
        <>
            <div className="blur">
                <div className="popup">
                    {/* Conditional class for the header based on the message type */}
                    <div className={`popup_header ${type === "success" ? "success_text" : "error_text"}`}>{header}</div>

                    {/* The main message content */}
                    <div className="popup_message">{text}</div>

                    {/* Loading indicator that is displayed when loading is true */}
                    <PropagateLoader color="#1876f2" size={20} loading={loading} />
                </div>
            </div>
        </>
    );
}
