import { ArrowCircleRight } from "@mui/icons-material";
import { IconButton, ImageList, ImageListItem, ImageListItemBar } from "@mui/material";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import mediumApiCall from "../../../controller/apiCall/mediumApiCall";
import { randomNumberGenerator } from "../../../functions/common";
import CommonDivider from "../../common/commonDivider";
import SubSectionTitle from "../../common/subSectionTitle";

export default function MyWritings({ data }) {

    const [ mediumArticles, setMediumArticles ] = useState(null);

    const fetchMediumArticles = useCallback(async () => {

        const res = await mediumApiCall();

        const from = randomNumberGenerator(res?.length - 3);
        const to = from + 3;

        setMediumArticles(res?.slice(from, to));

    }, [ setMediumArticles ]);

    useEffect(() => {
        fetchMediumArticles();
    }, [ fetchMediumArticles ] );

    const setGridSize = (mediumArticles) => mediumArticles.length;

    return (

        mediumArticles
            ? (
                <>
                    <br />
                    <SubSectionTitle data={ data } />
                    <br />

                    <ImageList cols={ setGridSize(mediumArticles) }>
                        {
                            mediumArticles.map((article) => <SingleArticle key={ article.guid } article={ article } />)
                        }
                    </ImageList>

                    <CommonDivider />
                </>
            )
            : null
    );
}

function SingleArticle({ article }) {

    const imageUrl: string = article.description.match(/<img[^>]+src="([^">]+)"/)[1];

    return (
        <Link href={ article.link } target="_blank" rel="noopener">
            <ImageListItem
                key={ imageUrl }
                style={ { cursor: "pointer" } }>
                <img
                    src={ imageUrl }
                    alt={ imageUrl }
                    loading="lazy"
                    style={ { mixBlendMode : "multiply" } }
                />
                <ImageListItemBar
                    title={ article.title }
                    actionIcon={
                        (<IconButton sx={ { color: "rgba(255, 255, 255, 1)" } }>
                            <ArrowCircleRight />
                        </IconButton>)
                    }
                />
            </ImageListItem>
        </Link>
    );
}
