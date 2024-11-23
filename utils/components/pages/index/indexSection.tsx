import PropTypes from "prop-types";
import Contact from "./contact";
import MyInterests from "./myInterests";
import MyWritings from "./myWritings";
import NameDetails from "./nameDetails";
import Phrase from "./Phrase";
import Projects from "./projects";
import LittleBitAboutMe from "../index/littleBitAboutMe";

function IndexSection({ content }) {

    return (
        <>
            {
                content.map((singleContent) => {
                    switch (singleContent.id) {
                        case 0:
                            return <NameDetails key="name" data={ singleContent } />;
                        // case 1:
                        //     return <Phrase key="name" data={ singleContent } />;
                        case 2:
                            return <LittleBitAboutMe key="me" data={ singleContent } />;
                        case 3:
                            return <MyInterests key="interests" data={ singleContent } />;
                        case 4:
                            return <Projects key="projects" data={ singleContent } />;
                        case 5:
                            return <MyWritings key="writings" data={ singleContent } />;
                        case 6:
                            return <Contact key="contact" data={ singleContent } />;
                        default:
                            break;
                    }
                })
            }
        </>

    );

}

IndexSection.propTypes = {
    experiences: PropTypes.arrayOf(PropTypes.object)
};

export default IndexSection;
