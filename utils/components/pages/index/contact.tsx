import { Avatar, Button, Stack, Typography } from "@mui/material";
import CommonDivider from "../../common/commonDivider";
import DescriptionList from "../../common/descriptionList";
import SubSectionTitle from "../../common/subSectionTitle";

export default function Contact({ data }) {
    return (
        <>
            <br />
            <SubSectionTitle data={ data } />
            <br />
            {
                data.content.map((contentDesc) => (
                    <span key={ contentDesc.key }>
                        <DescriptionList list={ contentDesc.content } />
                        <br />
                    </span>
                ))
            }
            <Stack direction="row" spacing={ 0 } justifyContent="center">
                {
                    data.icons.map((icon) => <SingleContact key={ icon.key } icon={ icon } />)
                }
            </Stack>
            <CommonDivider />
        </>
    );
}

function SingleContact({ icon }) {
    return (
        <Button href={ icon.link } target="_blank">
            <Avatar alt={ icon.alt } src={ icon.image } />
        </Button>
    );
}
