import { Button, Stack, Typography } from "@mui/material";

export default function SubSectionTitle({ data }) {
    return (
        <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h4" color="text.primary">
                { data.title }
            </Typography>
            {
                data.titleLink && (
                    <Button 
                        href={ data.titleLink.link } 
                        target={ data.titleLink.target ? data.titleLink.target : "_self" } 
                    >
                        <Typography variant="button" color="text.secondary">
                            { data.titleLink.text }
                        </Typography>
                    </Button>
                )
            }
        </Stack>
    );
}
