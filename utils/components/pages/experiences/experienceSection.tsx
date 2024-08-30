import PropTypes from "prop-types";
import ExperienceOverview from "./experienceOverview";
import CommonDivider from "../../common/commonDivider";
import DescriptionList from "../../common/descriptionList";

function Experiences({ experiences }) {
    return experiences.map((experience) => <SingleExperience experience={ experience } />);
}

Experiences.propTypes = {
    experiences: PropTypes.arrayOf(PropTypes.object)
};

function SingleExperience({ experience }) {

    return (
        <>
            <br />
            <ExperienceOverview
                title={ experience.title } />
            <br />
            <DescriptionList list={ experience.content } />

            <CommonDivider />
        </>
    );
}

export default Experiences;
