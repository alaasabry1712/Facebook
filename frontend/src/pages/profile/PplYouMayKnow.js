import { Dots } from "../../svg";
import { stories } from "../../data/home";
import AddFriendSmallCard from "./AddFriendSmallCard";

export default function PplYouMayKnow() {
    return (
        <div className="pplumayknow ">
            {/* Container for displaying people you may know. */}
            <div className="pplumayknow_header  inactive-link">
                {/* Header section for the "People You May Know" component. */}
                People You May Know
                <div className="post_header_right ppl_circle inactive-icon ">
                    {/* A button or icon to interact with the component. */}
                    <Dots />
                </div>
            </div>
            <div className="pplumayknow_list ">
                {/* List of people you may know. */}
                {stories.map((item, i) => (
                    <AddFriendSmallCard item={item} key={i} />
                    /* Map through the list of items and display AddFriendSmallCard component for each item. */
                ))}
            </div>
        </div>
    );
}
