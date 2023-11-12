// The Bio component is responsible for rendering a user details form.
export default function Bio({
    info,
    handleChange,
    max,
    setShowBio,
    updateDetails,
    placeholder,
    name,
    detail,
    setShow,
    rel,
}) {
    return (
        // Container for the user details form with class "add_bio_wrap"
        <div className="add_bio_wrap">
            {rel ? (
                // Conditional rendering: If 'rel' prop is true, render a select input for relationship status.
                <select className="select_rel" name={name} value={info.relationship} onChange={handleChange}>
                    <option value="Single">Single</option>
                    <option value="In a relationship">In a relationship</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                </select>
            ) : (
                // Conditional rendering: If 'rel' prop is false, render a textarea input for user details.
                <textarea
                    placeholder={placeholder}
                    name={name}
                    value={info?.[name]}
                    maxLength={detail ? 25 : 100} // Set character limit based on 'detail' prop.
                    className="textarea_blue details_input"
                    onChange={handleChange}
                ></textarea>
            )}
            {!detail && (
                // Display remaining characters when not a detailed input ('!detail').
                <div className="remaining">{max} characters remaining</div>
            )}
            <div className="flex">
                <div className="flex flex_left">
                    <i className="public_icon"></i>Public
                </div>
                <div className="flex flex_right">
                    <button className="gray_btn" onClick={() => (!detail ? setShowBio(false) : setShow(false))}>
                        Cancel
                    </button>
                    <button
                        className="blue_btn"
                        onClick={() => {
                            // Trigger the 'updateDetails' function when the "Save" button is clicked and close the form using 'setShow'.
                            updateDetails();
                            setShowBio(false);
                            setShow(false);
                        }}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
