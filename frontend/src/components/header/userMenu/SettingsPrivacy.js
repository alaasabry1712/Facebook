// This component displays a submenu for settings and privacy options.
export default function SettingsPrivacy({ setVisible }) {

    return (
        <div className="absolute_wrap">
            {/* Container for settings and privacy options. */}
            <div className="absolute_wrap_header">
                {/* Header section for settings and privacy. */}
                <div
                    className="circle hover1"
                    onClick={() => {
                        setVisible(0);
                    }}
                >
                    <i className="arrow_back_icon"></i>
                    {/* A circle with an arrow back icon to return to the previous menu. */}
                </div>
                Settings & privacy
                {/* Text indicating "Settings & privacy". */}
            </div>
            <div className="mmenu_item hover3">
                {/* A menu item for general settings. */}
                <div className="small_circle">
                    <i className="settings_filled_icon"></i>
                </div>
                <span>Settings</span>
                {/* Display "Settings" as an option to access general settings. */}
            </div>
            <div className="mmenu_item hover3">
                {/* A menu item for privacy checkup. */}
                <div className="small_circle">
                    <i className="privacy_checkup_icon"></i>
                </div>
                <span>Privacy Checkup</span>
                {/* Display "Privacy Checkup" as an option to review privacy settings. */}
            </div>
            <div className="mmenu_item hover3">
                {/* A menu item for privacy shortcuts. */}
                <div className="small_circle">
                    <i className="privacy_shortcuts_icon"></i>
                </div>
                <span>Privacy Shortcuts</span>
                {/* Display "Privacy Shortcuts" as an option to access privacy-related features. */}
            </div>
            <div className="mmenu_item hover3">
                {/* A menu item for the activity log. */}
                <div className="small_circle">
                    <i className="activity_log_icon"></i>
                </div>
                <span>Activity log</span>
                {/* Display "Activity log" as an option to view user activity history. */}
            </div>
            <div className="mmenu_item hover3">
                {/* A menu item for news feed preferences. */}
                <div className="small_circle">
                    <i className="news_icon"></i>
                </div>
                <span>News Feed Preferences</span>
                {/* Display "News Feed Preferences" as an option to customize news feed settings. */}
            </div>
            <div className="mmenu_item hover3">
                {/* A menu item for language settings. */}
                <div className="small_circle">
                    <i className="language_icon"></i>
                </div>
                <span>Language</span>
                {/* Display "Language" as an option to select preferred language settings. */}
            </div>
        </div>
    );
}
