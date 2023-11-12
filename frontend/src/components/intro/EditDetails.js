import { useRef } from "react";
import Detail from "./Detail";
import useOnCLickOutside from "../../helpers/clickOutside";

// EditDetails component allows the user to edit their personal details.
export default function EditDetails({ details, handleChange, updateDetails, info, setVisible }) {
    const modal = useRef(null);
    useOnCLickOutside(modal, () => setVisible(false)); // Close the modal when clicking outside.

    return (
        <div className="blur">
            <div className="postBox infoBox" ref={modal}>
                <div className="box_header">
                    <div className="small_circle" onClick={() => setVisible(false)}>
                        <i className="exit_icon"></i>
                    </div>
                    <span>Edit Details</span>
                </div>
                <div className="details_wrapper scrollbar">
                    <div className="details_col">
                        <span>Customize Your Intro</span>
                        <span>Details you select will be public</span>
                    </div>

                    {/* Various user details that can be edited */}
                    <div className="details_header">Other Name</div>
                    <Detail
                        value={details?.otherName}
                        img="public"
                        placeholder="Add other name"
                        name="otherName"
                        text="other Name"
                        handleChange={handleChange}
                        updateDetails={updateDetails}
                        info={info}
                    />

                    <div className="details_header">Work</div>
                    <Detail
                        value={details?.job}
                        img="job"
                        placeholder="Add job title"
                        name="job"
                        text="a job"
                        handleChange={handleChange}
                        updateDetails={updateDetails}
                        info={info}
                    />
                    <Detail
                        value={details?.workplace}
                        img="job"
                        placeholder="Add a workplace"
                        name="workplace"
                        text="workplace"
                        handleChange={handleChange}
                        updateDetails={updateDetails}
                        info={info}
                    />

                    <div className="details_header">Education</div>
                    <Detail
                        value={details?.highSchool}
                        img="studies"
                        placeholder="Add a high school"
                        name="highSchool"
                        text="a high school"
                        handleChange={handleChange}
                        updateDetails={updateDetails}
                        info={info}
                    />
                    <Detail
                        value={details?.college}
                        img="studies"
                        placeholder="Add a college"
                        name="college"
                        text="college"
                        handleChange={handleChange}
                        updateDetails={updateDetails}
                        info={info}
                    />

                    <div className="details_header">Current City</div>
                    <Detail
                        value={details?.currentCity}
                        img="home"
                        placeholder="Add a current city"
                        name="currentCity"
                        text="a current city"
                        handleChange={handleChange}
                        updateDetails={updateDetails}
                        info={info}
                    />

                    <div className="details_header">Hometown</div>
                    <Detail
                        value={details?.hometown}
                        img="home"
                        placeholder="Add hometown"
                        name="hometown"
                        text="hometown"
                        handleChange={handleChange}
                        updateDetails={updateDetails}
                        info={info}
                    />

                    <div className="details_header">Relationship</div>
                    <Detail
                        value={details?.relationship}
                        img="relationship"
                        placeholder="Add instagram"
                        name="relationship"
                        text="relationship"
                        handleChange={handleChange}
                        updateDetails={updateDetails}
                        info={info}
                        rel
                    />

                    <div className="details_header">Instagram</div>
                    <Detail
                        value={details?.instagram}
                        img="instagram"
                        placeholder="Add instagram"
                        name="instagram"
                        text="instagram"
                        handleChange={handleChange}
                        updateDetails={updateDetails}
                        info={info}
                    />
                </div>
            </div>
        </div>
    );
}
