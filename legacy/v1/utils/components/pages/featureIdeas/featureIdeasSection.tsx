import { ArrowCircleRight } from "@mui/icons-material";
import { CircularProgress, IconButton, ImageListItemBar } from "@mui/material";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Link from "next/link";
import { useState } from "react";
import styles from "./featureIdeaSection.module.css";

export default function FeatureIdeasSection({ featureIdeas }) {

    return (
        <ImageList
            variant="quilted"
            cols={ 2 }
            rowHeight={ 200 }
        >
            { featureIdeas.map((featureIdea) => (
                <FeatureIdeaCard key={ featureIdea.key } featureIdea={ featureIdea } />
            )) }
        </ImageList>
    );
}

function FeatureIdeaCard({ featureIdea }) {
    const [ showTitle, setShowTitle ] = useState(false);
    const [ loading, setLoading ] = useState(false);

    const handlefeatureIdeaClick = () => {
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
        <Link href={ `/featureIdeas/${featureIdea.key}` }>
            <ImageListItem
                key={ featureIdea.image }
                cols={ featureIdea.cols }
                rows={ featureIdea.rows }
                onMouseEnter={ () => setShowTitle(loading ? showTitle : true) }
                onMouseLeave={ () => setShowTitle(loading ? showTitle : false) }
                style={ { cursor: "pointer" } }
                onClick={ handlefeatureIdeaClick }
            >
                <img
                    { ...srcset(featureIdea.image, 1100, featureIdea.rows, featureIdea.cols) }
                    alt={ featureIdea.name }
                    className={ styles["feature-idea-image"] }
                    loading="lazy"
                />
                {
                    showTitle
                        ? (
                            <ImageListItemBar
                                title={ featureIdea.name }
                                subtitle={ featureIdea.role }
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
