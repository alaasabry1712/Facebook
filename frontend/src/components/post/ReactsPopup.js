// An array of reaction emojis, each object contains a name and image URL.
const reactsArray = [
    {
        name: "like",
        image: "../../../reacts/like.gif",
    },
    {
        name: "love",
        image: "../../../reacts/love.gif",
    },
    {
        name: "care",
        image: "../../../reacts/care.gif",
    },
    {
        name: "haha",
        image: "../../../reacts/haha.gif",
    },
    {
        name: "wow",
        image: "../../../reacts/wow.gif",
    },
    {
        name: "sad",
        image: "../../../reacts/sad.gif",
    },
    {
        name: "angry",
        image: "../../../reacts/angry.gif",
    },
];

export default function ReactsPopup({ visible, setVisible, reactHandler }) {
    return (
        <>
            {visible && (
                <div
                    className="reacts_popup"
                    onMouseOver={() => {
                        setTimeout(() => {
                            setVisible(true);
                        }, 500);
                    }}
                    onMouseLeave={() => {
                        setTimeout(() => {
                            setVisible(false);
                        }, 500);
                    }}
                >
                    {/* Map through the 'reactsArray' and render reaction images that can be clicked */}
                    {reactsArray.map((react, i) => (
                        <div className="react" key={i} onClick={() => reactHandler(react.name)}>
                            <img src={react.image} alt="" />
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
