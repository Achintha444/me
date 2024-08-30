import { ArrowCircleRight } from "@mui/icons-material";
import { CircularProgress, IconButton, ImageListItemBar } from "@mui/material";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Link from "next/link";
import { useState } from "react";

export default function ProjectSection({ projects }) {

    return (
        <ImageList
            variant="quilted"
            cols={ 2 }
            rowHeight={ 200 }
        >
            { projects.map((project) => (
                <ProjectCard key={ project.key } project={ project } />
            )) }
        </ImageList>
    );
}

function ProjectCard({ project }) {
    const [ showTitle, setShowTitle ] = useState(false);
    const [ loading, setLoading ] = useState(false);

    const handleProjectClick = () => {
        setLoading(true);
        setShowTitle(true); // Step 2: Update loading state when link is clicked
    };

    const srcset = (image: string, size: number, rows = 1, cols = 1) => {
        return {
            src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
            srcSet: `${image}?w=${size * cols}&h=${size * rows
            }&fit=crop&auto=format&dpr=2 2x`
        };
    };

    return (
        <Link href={ `/projects/${project.name}` }>
            <ImageListItem
                key={ project.image }
                cols={ project.cols }
                rows={ project.rows }
                onMouseEnter={ () => setShowTitle(loading ? showTitle : true) }
                onMouseLeave={ () => setShowTitle(loading ? showTitle : false) }
                style={ { cursor: "pointer" } }
                onClick={ handleProjectClick }
            >
                <img
                    { ...srcset(project.image, 1100, project.rows, project.cols) }
                    alt={ project.name }
                    loading="lazy"
                    style={ { mixBlendMode: "multiply" } }
                />
                {
                    showTitle
                        ? (
                            <ImageListItemBar
                                title={ project.name }
                                subtitle={ project.role }
                                actionIcon={
                                    (<IconButton sx={ { color: "rgba(255, 255, 255, 1)" } }>
                                        {
                                            loading
                                                ? <CircularProgress size="2rem" />
                                                : <ArrowCircleRight />
                                        }
                                    </IconButton>)
                                }
                            />
                        ): null
                }
            </ImageListItem>
        </Link>
    );
}
