export default function GridPosts() {
    return (
        <div className="createPost inactive-icon">
            <div className="createPost_header" style={{ justifyContent: "space-between" }}>
                {/* The header section of the "Create Post" component. */}
                <div className="left_header_grid">Posts</div> {/* Display "Posts" title. */}
                <div className="flex">
                    {/* A flex container for two buttons. */}
                    <div className="gray_btn">
                        <i className="equalize_icon"></i>
                    </div>
                    <div className="gray_btn">
                        <i className="manage_icon"></i>
                        Manage Posts
                    </div>
                </div>
            </div>
            <div className="create_splitter"></div> {/* A horizontal splitter line. */}
            <div className="createPost_body grid2">
                {/* The body of the "Create Post" component with grid layout. */}
                <div className="view_type active">
                    {/* Display "List view" option with an icon and text. */}
                    <i className="list_icon filter_blue"></i>
                    List view
                </div>
                <div className="view_type">
                    {/* Display "Grid view" option with an icon and text. */}
                    <i className="grid_icon"></i>
                    Grid view
                </div>
            </div>
        </div>
    );
}
