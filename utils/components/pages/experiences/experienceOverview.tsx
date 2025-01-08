import { List, ListItem, Typography } from "@mui/material";

export default function ExperienceOverview({ title }) {

    return (
        <List dense={ false } >
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
                    ? (<Typography variant="h6" color="text.primary">
                        { one }
                    </Typography>)
                    : null
            }


            {
                two
                    ? (<Typography variant="body1" color="text.secondary">
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
