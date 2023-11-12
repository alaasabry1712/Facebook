import React from "react";

export default function Story({ story }) {
    return (
        <div className="story">
            {/* Displaying the story image */}
            <img src={story.image} alt="" className="story_img inactive-icon" />

            {/* Story creator's profile picture */}
            <div className="story_profile_pic">
                <img className="inactive-icon" src={story.profile_picture} alt="" />
            </div>

            {/* Story creator's name */}
            <div className="story_profile_name inactive-link">{story.profile_name}</div>
        </div>
    );
}
