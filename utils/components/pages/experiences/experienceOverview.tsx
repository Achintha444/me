import { List, ListItem, Typography } from "@mui/material";

export default function ExperienceOverview({ title }) {

    return (
        <List dense={ true } >
            <SingleDetail one={ title[0] } />
            <SingleDetail two={ title[1] } />
            <SingleDetail three={ title[2] } />
        </List>
    );
}

function SingleDetail(prop) {

    const { one, two, three } = prop;

    return (
        <ListItem disablePadding>
            {
                one
                    ? (<Typography variant="h5" color="text.primary">
                        { one }
                    </Typography>)
                    : null
            }


            {
                two
                    ? (<Typography variant="body1" color="text.primary">
                        { two }
                    </Typography>)
                    : null
            }


            {
                three
                    ? (<Typography
                        variant="subtitle2"
                        color="text.secondary"
                        sx={ {
                            fontWeight: "normal"
                        } }>
                        { three }
                    </Typography>)
                    : null
            }

        </ListItem>
    );
}
