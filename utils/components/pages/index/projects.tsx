import { ArrowCircleRight } from "@mui/icons-material";
import {
    CircularProgress,
    IconButton,
    ImageList,
    ImageListItem,
    ImageListItemBar
} from "@mui/material";
import Link from "next/link";
import projectConfig from "../../../data/projects.json";
import CommonDivider from "../../common/commonDivider";
import SubSectionTitle from "../../common/subSectionTitle";
import { useState } from "react";

export default function Projects({ data }) {


    return (
        <>
            <br />
            <SubSectionTitle data={data} />
            <br />

            <ImageList cols={3}  variant="woven">
                {projectConfig.projects.slice(0, 3).map((project) => (
                    <SingleProject key={project.name} project={project} />
                ))}
            </ImageList>


            <CommonDivider />
        </>
    );
}

function SingleProject({ project }) {
    const [loading, setLoading] = useState(false);

    const handleProjectClick = () => {
        setLoading(true); // Step 2: Update loading state when link is clicked
    };

    return (
        <a href={`/projects/${project.name}`} onClick={handleProjectClick}>
            <ImageListItem key={project.image} style={{ cursor: "pointer" }}>
                <img
                    src={project.image}
                    alt={project.name}
                    loading="lazy"
                    style={{ mixBlendMode: "multiply" }}
                />
                <ImageListItemBar
                    title={project.name}
                    subtitle={project.role}
                    actionIcon={
                        <IconButton sx={{ color: "rgba(255, 255, 255, 1)" }}>
                                {
                                    loading
                                    ? <CircularProgress size="2rem"/>
                                    : <ArrowCircleRight />
                                }
                            </IconButton>
                    }
                />
            </ImageListItem>
        </a>
    );
}
