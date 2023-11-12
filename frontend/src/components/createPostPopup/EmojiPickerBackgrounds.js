import { useEffect, useRef, useState } from "react"; // Importing React hooks for managing component state.
import Picker from "emoji-picker-react"; // Importing the emoji picker component.
import { useMediaQuery } from "react-responsive"; // Importing a hook for media query responsiveness.

export default function EmojiPickerBackgrounds({ text, user, setText, type2, background, setBackground }) {
    const [picker, setPicker] = useState(false); // Managing state for displaying the emoji picker.
    const [showBgs, setShowBgs] = useState(false); // Managing state for showing post backgrounds.
    const [cursorPosition, setCursorPosition] = useState(); // Managing the cursor position in the text area.
    const textRef = useRef(null); // Creating a reference to the text area element.
    const bgRef = useRef(null); // Creating a reference to the background container.

    useEffect(() => {
        textRef.current.selectionEnd = cursorPosition; // Update the cursor position in the text area.
    }, [cursorPosition]);

    // Function to handle the selection of an emoji.
    const handleEmoji = (e, { emoji }) => {
        const ref = textRef.current;
        ref.focus();
        const start = text.substring(0, ref.selectionStart);
        const end = text.substring(ref.selectionStart);
        const newText = start + emoji + end;
        setText(newText); // Insert the selected emoji into the text.
        setCursorPosition(start.length + emoji.length); // Update the cursor position.
    };

    const postBackgrounds = [
        "../../../images/postbackgrounds/1.jpg",
        "../../../images/postbackgrounds/2.jpg",
        "../../../images/postbackgrounds/3.jpg",
        "../../../images/postbackgrounds/4.jpg",
        "../../../images/postbackgrounds/5.jpg",
        "../../../images/postbackgrounds/6.jpg",
        "../../../images/postbackgrounds/7.jpg",
        "../../../images/postbackgrounds/8.jpg",
        "../../../images/postbackgrounds/9.jpg",
    ];

    // Function to handle the selection of a post background.
    const backgroundHanlder = (i) => {
        bgRef.current.style.backgroundImage = `url(${postBackgrounds[i]})`;
        setBackground(postBackgrounds[i]); // Set the selected background image.
        bgRef.current.classList.add("bgHandler"); // Add a CSS class to the background container.
    };

    const removeBackground = () => {
        bgRef.current.style.backgroundImage = "";
        setBackground(""); // Remove the background image.
        bgRef.current.classList.remove("bgHandler"); // Remove the CSS class from the background container.
    };

    const sm = useMediaQuery({
        query: "(max-width:550px)",
    });

    return (
        /* 
        The type2 variable is a prop passed to the EmojiPickerBackgrounds component, 
        and its purpose is to conditionally style the component based on its value.
       */
        <div className={type2 ? "images_input" : ""}>
            <div className={!type2 ? "flex_center" : ""} ref={bgRef}>
                <textarea
                    ref={textRef}
                    maxLength="250"
                    value={text}
                    placeholder={`What's on your mind, ${user.first_name}`}
                    className={`post_input ${type2 ? "input2" : ""} ${sm && !background && "l0"}`}
                    onChange={(e) => setText(e.target.value)}
                    style={{
                        paddingTop: `${background ? Math.abs(textRef.current.value.length * 0.1 - 32) : "0"}%`,
                    }}
                ></textarea>
            </div>
            <div className={!type2 ? "post_emojis_wrap" : ""}>
                {picker && (
                    <div className={`comment_emoji_picker ${type2 ? "movepicker2" : "rlmove"}`}>
                        <Picker onEmojiClick={handleEmoji} /> {/* Display the emoji picker. */}
                    </div>
                )}
                {!type2 && (
                    <img
                        src="../../../icons/colorful.png"
                        alt=""
                        onClick={() => {
                            setShowBgs((prev) => !prev); // Toggle the display of post backgrounds.
                        }}
                    />
                )}
                {!type2 && showBgs && (
                    <div className="post_backgrounds">
                        {/* Display post background options. */}
                        <div
                            className="no_bg"
                            onClick={() => {
                                removeBackground(); // Remove the selected background.
                            }}
                        ></div>
                        {postBackgrounds.map((bg, i) => (
                            <img
                                src={bg}
                                key={i}
                                alt=""
                                onClick={() => {
                                    backgroundHanlder(i); // Set a background image.
                                }}
                            />
                        ))}
                    </div>
                )}

                <i
                    className={`emoji_icon_large ${type2 ? "moveleft" : ""}`}
                    onClick={() => {
                        setPicker((prev) => !prev); // Toggle the emoji picker.
                    }}
                ></i>
            </div>
        </div>
    );
}
