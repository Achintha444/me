import Error from "next/error";
import React from "react";
import DescriptionList from "../../utils/components/common/descriptionList";
import MainGrid from "../../utils/components/common/mainGrid";
import NavBar from "../../utils/components/common/navBar";
import Title from "../../utils/components/common/title";
import OverallDetails from "../../utils/components/pages/projects-id/overallDetails"
import featureIdeaConfig from "../../utils/data/featureIdeas.json";

export async function getServerSideProps(context) {

    const featureIdeaKey = context.query.id;
    const featureIdeas = featureIdeaConfig.features;

    const featureIdea = featureIdeas.filter((featureIdea) => featureIdea.key === featureIdeaKey)[0];

    if (featureIdea) {
        return {
            props: { featureIdea }
        };
    }

    return {
        props : {}
    };
}

export default function SinglefeatureIdea({ featureIdea }) {

    return (
        featureIdea
            ?
            (<>
                <NavBar />
                <Title title={ featureIdea.name } />
                <MainGrid>
                    {
                        featureIdea.overview && <OverallDetails overview={ featureIdea.overview } />
                    }
                    <br />
                    <DescriptionList list={ featureIdea.content } />
                </MainGrid>
            </>)
            : <Error statusCode={ 404 } />
    );
}
