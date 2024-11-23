import Stack from "@mui/material/Stack";
import CommonDivider from "../../common/commonDivider";
import SubSectionTitle from "../../common/subSectionTitle";

export default function Phrase({ data }) {
    return (
        <>
            <Stack spacing={1} justifyContent="center" alignItems="center">
                <SubSectionTitle key="little-phrase" data={data} />
            </Stack>
            <CommonDivider />
        </>
    );
}
