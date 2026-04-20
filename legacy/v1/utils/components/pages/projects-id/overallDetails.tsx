import { Grid, List, ListItem, ListItemText, Typography } from "@mui/material";

export default function OverallDetails({ overview }) {
    return (
        <List dense={ true } >
            {
                overview.map((item)=> 
                    <OverallDetailsItem key={ item.key } title={ item.title } body={ item.body }/>
                )
            }
        </List>
    );
}

function OverallDetailsItem({ body, title }) {
    return (
        <ListItem disableGutters disablePadding>
            <ListItemText
                primary={
                    (
                        <Grid container justifyContent="flex-start" spacing={ { md: 1, xs: 2 } } >
                            <Grid item xs={ 3 } sm={ 1 } md={ 1.5 } lg={ 1 }>
                                <Typography variant="body2" color="text.secondary">
                                    { title }
                                </Typography>
                            </Grid>
                            <Grid item xs={ 8 }>
                                <Typography variant="body2" color="text.primary">
                                    <b>{ body }</b>
                                </Typography>
                            </Grid>
                        </Grid>
                    )
                } />
        </ListItem>
    );
}
