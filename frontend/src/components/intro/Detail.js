import { useState } from "react";
import Bio from "./Bio";

// Detail component is responsible for rendering a specific user detail section.
export default function Detail({ img, value, placeholder, name, handleChange, updateDetails, info, text, rel }) {
    // Initialize a state variable 'show' to control the visibility of the Bio component.
    const [show, setShow] = useState(false);
    const [showBio, setShowBio] = useState(false);

    return (
        <div>
            <div className="add_details_flex" onClick={() => setShow(true)}>
                {value ? (
                    // If 'value' exists, display the existing user detail with an edit icon.
                    <div className="info_profile">
                        <img src={`../../../icons/${img}.png`} alt="" />
                        {value}
                        <i className="edit_icon"></i>
                    </div>
                ) : (
                    // If 'value' doesn't exist, display an "Add" option for a specific detail type.
                    <>
                        <i className="rounded_plus_icon"></i>
                        <span className="underline">Add {text}</span>
                    </>
                )}
            </div>
            {show && (
                // If 'show' is true, render the Bio component to edit the detail.
                <Bio
                    placeholder={placeholder}
                    name={name}
                    handleChange={handleChange}
                    updateDetails={updateDetails}
                    info={info}
                    detail // Set 'detail' prop to indicate this is a detailed input.
                    setShow={setShow} // Pass the setShow function to control the visibility of the Bio component.
                    setShowBio={setShowBio}
                    rel={rel}
                />
            )}
        </div>
    );
}
