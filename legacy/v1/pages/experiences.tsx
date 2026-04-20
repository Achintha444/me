import React from "react";
import MainGrid from "../utils/components/common/mainGrid";
import NavBar from "../utils/components/common/navBar";
import Title from "../utils/components/common/title";
import ExperienceSection from "../utils/components/pages/experiences/experienceSection";
import experienceConfig from "../utils/data/experience.json";

export default function Experiences() {
    return (
        <>
            <NavBar />
            <Title title={ experienceConfig.pageTitle } />
            <MainGrid>
                <ExperienceSection experiences={ experienceConfig.experiences }/>
            </MainGrid>
        </>

    );
}
