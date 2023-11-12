import { useEffect, useState } from "react";
import Bio from "./Bio";
import "./style.css";
import axios from "axios";
import { useSelector } from "react-redux";
import EditDetails from "./EditDetails";

export default function Intro({ detailss, visitor, setOthername }) {
    // State variables to manage user details and form visibility
    const { user } = useSelector((state) => ({ ...state }));
    const [details, setDetails] = useState();
    const [visible, setVisible] = useState(false);
    const [showBio, setShowBio] = useState(false);

    useEffect(() => {
        // Set initial user details and form values when detailss prop changes
        setDetails(detailss);
        setinfo(detailss);
    }, [detailss]);

    // Define initial user details as an object
    const initial = {
        bio: details?.bio ? details.bio : "",
        otherName: details?.otherName ? details.otherName : "",
        job: details?.job ? details.job : "",
        workplace: details?.workplace ? details.workplace : "",
        highSchool: details?.highSchool ? details.highSchool : "",
        college: details?.college ? details.college : "",
        currentCity: details?.currentCity ? details.currentCity : "",
        hometown: details?.hometown ? details.hometown : "",
        relationship: details?.relationship ? details.relationship : "",
        instagram: details?.instagram ? details.instagram : "",
    };

    // State variable to manage user details form data
    const [info, setinfo] = useState(initial);
    const [max, setMax] = useState(info?.bio ? 100 - info?.bio.length : 100);

    // Function to handle changes in the form inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setinfo({ ...info, [name]: value });
        setMax(100 - e.target.value.length);
    };

    // Function to update user details via an HTTP request
    const updateDetails = async () => {
        try {
            console.log("sent");
            const { data } = await axios.put(
                `${process.env.REACT_APP_BACKEND_URL}/updateDetails`,
                {
                    info,
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );
            setShowBio(false);
            setDetails(data);
            setOthername(data.otherName);
        } catch (error) {
            console.log(error.response.data.message);
        }
    };

    return (
        <div className="profile_card">
            <div className="profile_card_header">Intro</div>
            {details?.bio && !showBio && (
                <div className="info_col">
                    <span className="info_text">{details?.bio}</span>
                    {!visitor && (
                        <button className="gray_btn hover1" onClick={() => setShowBio(true)}>
                            Edit Bio
                        </button>
                    )}
                </div>
            )}
            {!details?.bio && !showBio && !visitor && (
                <button className="gray_btn hover1 w100" onClick={() => setShowBio(true)}>
                    Add Bio
                </button>
            )}
            {showBio && (
                // Render the Bio component for editing user's bio
                <Bio
                    info={info}
                    max={max}
                    handleChange={handleChange}
                    setShowBio={setShowBio}
                    updateDetails={updateDetails}
                    placeholder="Add Bio"
                    name="bio"
                />
            )}

            {/* Display various user details */}
            {details?.job && details?.workplace ? (
                <div className="info_profile">
                    <img src="../../../icons/job.png" alt="" />
                    works as {details?.job} at <b>{details?.workplace}</b>
                </div>
            ) : details?.job && !details?.workplace ? (
                <div className="info_profile">
                    <img src="../../../icons/job.png" alt="" />
                    works as {details?.job}
                </div>
            ) : (
                details?.workplace &&
                !details?.job && (
                    <div className="info_profile">
                        <img src="../../../icons/job.png" alt="" />
                        works at {details?.workplace}
                    </div>
                )
            )}

            {/* Additional user details */}
            {details?.relationship && (
                <div className="info_profile">
                    <img src="../../../icons/relationship.png" alt="" />
                    {details?.relationship}
                </div>
            )}
            {details?.college && (
                <div className="info_profile">
                    <img src="../../../icons/studies.png" alt="" />
                    studied at {details?.college}
                </div>
            )}
            {details?.highSchool && (
                <div className="info_profile">
                    <img src="../../../icons/studies.png" alt="" />
                    studied at {details?.highSchool}
                </div>
            )}
            {details?.currentCity && (
                <div className="info_profile">
                    <img src="../../../icons/home.png" alt="" />
                    Lives in {details?.currentCity}
                </div>
            )}
            {details?.hometown && (
                <div className="info_profile">
                    <img src="../../../icons/home.png" alt="" />
                    From {details?.hometown}
                </div>
            )}
            {details?.hometown && (
                <div className="info_profile">
                    <img src="../../../icons/instagram.png" alt="" />
                    <a href={`https://www.instagram.com/${details?.instagram}`} target="_blank">
                        {details?.instagram}
                    </a>
                </div>
            )}

            {/* Buttons for editing user details and adding hobbies and featured */}
            {!visitor && (
                <button className="gray_btn hover1 w100" onClick={() => setVisible(true)}>
                    Edit Details
                </button>
            )}
            {visible && !visitor && (
                // Render the EditDetails component for editing user's details
                <EditDetails
                    details={details}
                    handleChange={handleChange}
                    updateDetails={updateDetails}
                    info={info}
                    setVisible={setVisible}
                />
            )}

            {!visitor && <button className="gray_btn inactive-icon w100">Add Hobbies</button>}
            {!visitor && <button className="gray_btn inactive-icon w100">Add Featured</button>}
        </div>
    );
}
