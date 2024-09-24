import MainGrid from "../utils/components/common/mainGrid";
import NavBar from "../utils/components/common/navBar";
import Title from "../utils/components/common/title";
import FeatureIdeasSection from "../utils/components/pages/featureIdeas/featureIdeasSection";
import featureIdeasConfig from "../utils/data/featureIdeas.json";

export default function FeatureIdeas() {
    return (
        <>
            <NavBar />
            <Title title={ featureIdeasConfig.pageTitle } />
            <MainGrid>
                <FeatureIdeasSection featureIdeas={ featureIdeasConfig.features }/>
            </MainGrid>
        </>

    );
}
