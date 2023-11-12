export default function MenuItem({ icon, title, subtitle, img }) {
    return (
        <li className="inactive-icon">
            {img ? (
                // If the 'img' prop is provided, display an image with the source specified by the 'img' prop.
                <img src={img} alt="" />
            ) : (
                // If 'img' prop is not provided, display an icon specified by the 'icon' prop.
                <i className={icon}></i>
            )}
            <div className="post_menu_text">
                {/* Display the title provided by the 'title' prop. */}
                <span>{title}</span>
                {subtitle && (
                    // If a 'subtitle' prop is provided, display it as a secondary text.
                    <span className="menu_post_col">{subtitle}</span>
                )}
            </div>
        </li>
    );
}
