import "./style.css";
import LeftLink from "./LeftLink";
import { left } from "../../../data/home";
import { Link } from "react-router-dom";
import { ArrowDown1 } from "../../../svg";
import { useState } from "react";
import Shortcut from "./Shortcut";

export default function LeftHome({ user }) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="left_home scrollbar">
            {/* User profile link */}
            <Link to="/profile" className="left_link hover1">
                <img src={user?.picture} alt="" />
                <span>
                    {user?.first_name} {user.last_name}
                </span>
            </Link>

            {/* Links to various sections (top 8) */}
            {left.slice(0, 8).map((link, i) => (
                <LeftLink key={i} img={link.img} text={link.text} notification={link.notification} />
            ))}

            {/* "See more" link to expand the section */}
            {!visible && (
                <div
                    className="left_link hover1 inactive-link"
                    onClick={() => {
                        setVisible(true);
                    }}
                >
                    <div className="small_circle inactive-icon">
                        <ArrowDown1 />
                    </div>
                    <span>See more</span>
                </div>
            )}

            {/* Expanded section (links beyond the top 8) */}
            {visible && (
                <div className="more_left">
                    {left.slice(8, left.length).map((link, i) => (
                        <LeftLink key={i} img={link.img} text={link.text} notification={link.notification} />
                    ))}

                    {/* "Show less" link to collapse the section */}
                    <div
                        className="left_link hover1 inactive-link"
                        onClick={() => {
                            setVisible(false);
                        }}
                    >
                        <div className="small_circle rotate360 inactive-icon">
                            <ArrowDown1 />
                        </div>
                        <span>Show less</span>
                    </div>
                </div>
            )}

            {/* Splitter line */}
            <div className="splitter"></div>

            {/* Shortcuts section */}
            <div className="shortcut">
                <div className="heading">Your Shortcuts</div>
                <div className="edit_shortcut">Edit</div>
            </div>

            {/* List of shortcuts */}
            <div className="shortcut_list">
                <Shortcut link="https://www.youtube.com" img="../../images/ytb.png" name="Youtube" />
                <Shortcut link="https://www.instagram.com" img="../../images/insta.png" name="Instagram" />
            </div>

            {/* Facebook copyright information */}
            <div className={`fb_copyright ${visible && "relative_fb_copyright"}`}>
                <div className="">
                    <span to="/">Privacy</span>
                    <span>. </span>
                    <span to="/">Terms</span>
                    <span>. </span>
                    <span to="/">Advertising</span>
                    <span>. </span>
                    <span to="/">
                        Ad Choices <i className="ad_choices_icon"></i>
                    </span>
                    <span>. </span>
                    <span to="/"></span>Cookies <span>. </span>
                    <span to="/">More</span>
                    <span>. </span> <br />
                    Meta © 2022
                </div>
            </div>
        </div>
    );
}
