// This component is designed to display options related to help and support.
export default function HelpSupport({ setVisible }) {
    return (
        <>
            <div className="absolute_wrap">
                {/* A container for help and support options. */}
                <div className="absolute_wrap_header">
                    {/* Header section for help and support. */}
                    <div
                        className="circle hover1"
                        onClick={() => {
                            setVisible(0);
                        }}
                    >
                        <i className="arrow_back_icon"></i>
                        {/* A circle with an arrow back icon for returning to the previous screen. */}
                    </div>
                    Help & Support
                    {/* Text indicating "Help & Support". */}
                </div>
                <div className="mmenu_item hover3">
                    {/* A menu item for accessing the Help Center. */}
                    <div className="small_circle">
                        <i className="help_center_icon"></i>
                        {/* A small circle with an icon representing the Help Center. */}
                    </div>
                    <span>Help Center</span>
                    {/* Display "Help Center" as an option to access support resources. */}
                </div>
                <div className="mmenu_item hover3">
                    {/* A menu item for accessing the Support Inbox. */}
                    <div className="small_circle">
                        <i className="email_icon"></i>
                        {/* A small circle with an email icon representing the Support Inbox. */}
                    </div>
                    <span>Support Inbox</span>
                    {/* Display "Support Inbox" as an option to access support messages. */}
                </div>
                <div className="mmenu_item hover3">
                    {/* A menu item for reporting a problem. */}
                    <div className="small_circle">
                        <i className="info_filled_icon"></i>
                        {/* A small circle with an icon representing reporting a problem. */}
                    </div>
                    <span>Report a Problem</span>
                    {/* Display "Report a Problem" as an option for reporting issues or problems. */}
                </div>
            </div>
        </>
    );
}
