import React from "react";

// This component represents an individual item in the "All Menu."
export default function AllMenuItem({ name, description, icon }) {
    return (
        <div className="all_menu_item hover1">
            {/* An individual menu item with a hover effect. */}
            <img src={`../../left/${icon}.png`} alt="" />
            {/* Display an icon associated with the menu item. */}
            <div className="all_menu_col">
                {/* A container for menu item details, including name and description. */}
                <span>{name}</span>
                {/* Display the name of the menu item. */}
                <span>{description}</span>
                {/* Display a brief description of the menu item. */}
            </div>
        </div>
    );
}
