import { List, ListItem, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";
import ImageListComponent from "./imageListComponent";
import ExperienceOverview from "../pages/experiences/experienceOverview";

function BodyList({ list }) {
    return (
        <Stack spacing={ 3 }>
            {
                list.map((item) => (
                    <BodyListItem
                        key={ item.key }
                        title={ item?.title }
                        body={ item?.body }
                        links={ item?.links }
                        images={ item?.images }
                        presentations={ item?.presentations } 
                    />
                ))
            }
        </Stack>
    );
}

BodyList.propTypes = {
    list: PropTypes.arrayOf(PropTypes.object)
};

export default BodyList;

function BodyListItem({ title, body, links, images, presentations }) {

    return (
        <Stack spacing={ 0.8 }>
            {
                title
                    ? (typeof title === "string") 
                        ? <Typography variant="body1" color="text.primary"> { title } </Typography>
                        : <ExperienceOverview title={ title } />
                    : null
            }
            {
                body 
                    ? typeof body === "string"
                        ? (
                            <Typography 
                                variant="body2" 
                                color="text.secondary" 
                                sx={ title ? null : { marginTop: "-10px" } }
                            >
                                { body }
                            </Typography>
                        )
                        : (
                            <Stack spacing={ 2 }>
                                {
                                    body.map((para) => (
                                        <Typography 
                                            key={ para.body }
                                            variant="body2" 
                                            color="text.secondary" 
                                            sx={ title ? null : { marginTop: "-10px" } }
                                        >
                                            { para.body }
                                        </Typography>
                                    ))
                                }
                            </Stack>
                        )
                    : null
            }
            {
                links
                    ?
                    (<List dense disablePadding>
                        {
                            links.map((item) => (
                                <ListItem key={ item.title } alignItems="flex-start" disableGutters>
                                    <Typography variant="body2" color="text.secondary">
                                        <a href={ item.link } target="_blank" rel="noreferrer">
                                            <u><i>{ item.title }</i></u>
                                        </a>
                                    </Typography>
                                </ListItem>
                            ))
                        }
                    </List>)
                    : null
            }
            {
                images
                    ? (
                        <div style={ !title ? null : { marginTop: "3px" } }>
                            <ImageListComponent imageList={ images } />
                        </div>
                    ): null
            }
            {
                presentations
                    ? (
                        <List dense disablePadding>
                            {
                                presentations.map((presentation) => (
                                    <ListItem key={ presentation.link } alignItems="center" disableGutters>
                                        <iframe 
                                            loading="lazy" 
                                            src={ presentation.link } 
                                            allowFullScreen 
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" 
                                            width="100%" 
                                            style={ { height: "60vh" } }
                                        />
                                    </ListItem>
                                ))
                            }
                        </List>
                    ) : null
            }

        </Stack >
    );
}

BodyListItem.propTypes = {
    body: PropTypes.string,
    title: PropTypes.string
};
