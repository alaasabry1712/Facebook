// LeftLink component renders individual links in the left sidebar.
export default function LeftLink({ img, text, notification }) {
    return (
        <div className="left_link hover1 ">
            {/* Render the link icon based on the 'img' prop. */}
            <img className="inactive-icon" src={`../../../left/${img}.png`} alt="" />
            <div className="col inactive-link">
                {/* Display the link text. */}
                <div className="col_1 inactive-link">{text}</div>
            </div>
        </div>
    );
}
