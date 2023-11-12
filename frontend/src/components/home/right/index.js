import "./style.css";
import { Dots, NewRoom, Search } from "../../../svg";
import Contact from "./Contact";

// RightHome component represents the right sidebar in the home page.
export default function RightHome({ user }) {
    const color = "#65676b"; // Define a color for icons.

    return (
        <div className="right_home">
            <div className="heading">Sponsored</div> {/* Display a heading for sponsored content. */}
            <div className="splitter1"></div> {/* Add a horizontal splitter line. */}
            {/* Contacts section */}
            <div className="contacts_wrap">
                <div className="contacts_header">
                    <div className="contacts_header_left">Contacts</div> {/* Display the "Contacts" heading. */}
                    <div className="contacts_header_right">
                        {/* Right side of the Contacts header with action icons */}
                        <div className="contact_circle hover1 inactive-icon">
                            <NewRoom color={color} /> {/* Icon for creating a new room. */}
                        </div>
                        <div className="contact_circle hover1 inactive-icon">
                            <Search color={color} /> {/* Icon for searching contacts. */}
                        </div>
                        <div className="contact_circle hover1 inactive-icon">
                            <Dots color={color} /> {/* Icon for more options. */}
                        </div>
                    </div>
                </div>
                <div className="contacts_list">
                    <Contact user={user} /> {/* Display a list of contacts. */}
                </div>
            </div>
        </div>
    );
}
