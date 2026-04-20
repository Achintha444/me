import React from "react";
import MainGrid from "../utils/components/common/mainGrid";
import NavBar from "../utils/components/common/navBar";
import IndexSection from "../utils/components/pages/index/indexSection";
import indexConfig from "../utils/data/index.json";

export default function Projects() {
    return (
        <>
            <NavBar />
            <MainGrid>
                <IndexSection content={ indexConfig.content } />
            </MainGrid>
        </>

    );
}
