import React from "react";
import { menu, create } from "../../data/allMenu"; // Imported menu data
import AllMenuItem from "./AllMenuItem"; // Reusable menu item component

// This component displays a menu with categorized items.
export default function AllMenu() {
    return (
        <div className="all_menu">
            {/* The main container for the menu. */}
            <div className="all_menu_header">Menu</div>
            {/* The menu header. */}
            <div className="all_menu_wrap scrollbar">
                {/* The scrollable container for menu items. */}
                <div className="all_left">
                    {/* The left column with categorized items. */}
                    <div className="all_menu_search">
                        {/* Search bar to search for specific menu items. */}
                        <i className="amm_s_ic"></i>
                        <input type="text" placeholder="Search Menu" />
                    </div>
                    <div className="all_menu_group">
                        {/* Categorized menu group for "Social" items. */}
                        <div className="all_menu_group_header">Social</div>
                        {/* Display menu items from the "Social" category. */}
                        {menu.slice(0, 6).map((item, i) => (
                            <AllMenuItem name={item.name} description={item.description} icon={item.icon} key={i} />
                        ))}
                    </div>
                    {/* More categorized menu groups follow... */}
                    {/* Each group displays items based on the category. */}
                </div>
                <div className="all_right">
                    {/* The right column with "Create" items. */}
                    <div className="all_right_header">Create</div>
                    {/* Display "Create" items. */}
                    {create.map((item, i) => (
                        <div className="all_right_item hover1" key={i}>
                            <div className="all_right_circle">
                                <i className={item.icon}></i>
                            </div>
                            {item.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
