import React from "react";
import { ArrowRight, Plus } from "../../../svg"; // Importing SVG icons
import "./style.css";
import { stories } from "../../../data/home"; // Importing story data
import Story from "./Story"; // Importing the Story component
import { useMediaQuery } from "react-responsive"; // Importing useMediaQuery for responsive design

export default function Stories() {
    // Define media query conditions for different screen widths
    const query1175px = useMediaQuery({
        query: "(max-width: 1175px)",
    });
    const query1030px = useMediaQuery({
        query: "(max-width: 1030px)",
    });
    const query960px = useMediaQuery({
        query: "(max-width: 960px)",
    });
    const query885px = useMediaQuery({
        query: "(max-width: 885px)",
    });

    // Calculate the maximum number of stories to display based on screen size
    const max = query885px ? 5 : query960px ? 4 : query1030px ? 5 : query1175px ? 4 : stories.length;

    return (
        <div className="stories">
            {/* "Create Story" card */}
            <div className="create_story_card">
                <img src="../../../images/default_pic.png" alt="" className="create_story_img inactive-icon" />
                <div className="plus_story inactive-icon">
                    <Plus color="#fff" /> {/* Plus icon */}
                </div>
                <div className="story_create_text inactive-link">Create Story</div> {/* Text for creating a story */}
            </div>

            {/* List of stories */}
            {stories.slice(0, max).map((story, i) => (
                <Story story={story} key={i} /> // Rendering Story component for each story
            ))}

            {/* Navigation arrow (right) */}
            <div className="white_circle inactive-icon">
                <ArrowRight color="#65676b" /> {/* Right arrow icon */}
            </div>
        </div>
    );
}
