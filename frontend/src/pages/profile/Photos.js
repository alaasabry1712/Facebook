export default function Photos({ username, token, photos }) {
    return (
        <div className="profile_card">
            {/* A container for displaying the user's photos. */}
            <div className="profile_card_header">
                {/* The header section of the profile card for photos. */}
                Photos {/* Display "Photos" title. */}
                <div className="profile_header_link inactive-icon">
                    {/* Link to navigate to all photos. */}
                    See all photos
                </div>
            </div>
            <div className="profile_card_count">
                {/* Display the total count of photos. */}
                {photos.total_count === 0 ? "" : photos.total_count === 1 ? "1 Photo" : `${photos.total_count} photos`}
                {/* Conditionally display the total photo count as text. */}
            </div>
            <div className="profile_card_grid">
                {/* Container for displaying a grid of photos. */}
                {photos.resources &&
                    photos.resources.slice(0, 9).map((img) => (
                        <div className="profile_photo_card" key={img.public_id}>
                            {/* Individual photo card. */}
                            <img src={img.secure_url} alt="" />
                            {/* Display the photo using its secure URL. */}
                        </div>
                    ))}
            </div>
        </div>
    );
}
