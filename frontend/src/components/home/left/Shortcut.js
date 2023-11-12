// Shortcut component renders a single shortcut item.
export default function Shortcut({ link, img, name }) {
    return (
        <a href={link} target="_blank" rel="noreferrer" className="shortcut_item">
            {/* Render the shortcut item as a clickable link with 'link' as the href. */}
            <img src={img} alt="" /> {/* Display the shortcut's icon. */}
            <span>{name}</span> {/* Display the name of the shortcut. */}
        </a>
    );
}
