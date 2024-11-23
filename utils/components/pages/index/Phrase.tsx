import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CommonDivider from "../../common/commonDivider";
import SubSectionTitle from "../../common/subSectionTitle";

export default function Phrase({ data }) {
    return (
        <>
            <Stack spacing={ 1 } justifyContent="center" alignItems="center">
                <Typography variant="body2" color="text.primary"> { data.title } </Typography>
            </Stack>
            <CommonDivider />
        </>
    );
}
