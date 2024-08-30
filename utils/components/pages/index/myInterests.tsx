import { Avatar, Chip, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import CommonDivider from "../../common/commonDivider";
import SubSectionTitle from "../../common/subSectionTitle";

export default function MyInterests({ data }) {
    return (
        <>
            <br />
            <SubSectionTitle data={ data } />
            <br />
            {
                data.interests.map((interest) => (
                    <span key={ interest.key }>
                        <Interest interest={ interest } />
                        <br />
                    </span>
                ))
            }
            <CommonDivider />
        </>
    );
}

function Interest({ interest }) {

    return (
        <Stack spacing={ 1 }>
            <Typography
                variant="h6"
                color="text.secondary"
                sx={ {
                    fontWeight: "normal"
                } }>
                { interest.title }
            </Typography>
            <Stack direction="column" spacing={ 0.5 }>
                {
                    interest.interests.map(
                        (interestDetails) => (
                            <Chip
                                key = { interestDetails.title }
                                avatar={ 
                                    interestDetails.imageUrl 
                                        ? <Avatar src={ interestDetails.imageUrl } /> 
                                        : null 
                                }
                                label={ interestDetails.title }
                                color={ interest.color }
                            />
                        )
                    )
                }
            </Stack>
        </Stack>
    );
}
