import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { TypeAnimation } from "react-type-animation";
import styles from "../../../../styles/Home.module.css";
import { Time, getTime } from "../../../functions/common";
import CommonDivider from "../../common/commonDivider";
import SubSectionTitle from "../../common/subSectionTitle";
import { title } from "process";

export default function NameDetails({ data }) {

    return (
        <>
            <div className={styles["nameContainer"]}>
                <Stack className={styles["stack"]} spacing={3} justifyContent="center" alignItems="center">
                    <Stack spacing={1} justifyContent="center" alignItems="center">
                        <Salutation salutationData={data.content[0]} />
                        <MyNameIs myNameIs={data.content[1]} />
                    </Stack>
                    <Name name={data.content[2]} />
                    <Stack spacing={1} justifyContent="center" alignItems="center">
                        <MyNameIs myNameIs={data.content[3]} />
                        <Occupation occupation={data.content[4]} />
                    </Stack>
                    {/* <Stack spacing={1} justifyContent="center" alignItems="center">
                        <SubSectionTitle key="little-phrase" data={ {title: "Bridging Design and Development"} } />
                    </Stack> */}
                </Stack>
            </div>
            <CommonDivider />
        </>
    );
}

function Salutation({ salutationData }) {
    const [time, setTime] = useState(Time.MORNING);
    const [salutaion, setSalutation] = useState(salutationData.morningSalute);

    useEffect(() => {
        setTime(getTime());
    }, [setTime, getTime]);

    useEffect(() => {
        switch (time) {
            case Time.MORNING:
                setSalutation(salutationData.morningSalute);

                break;
            case Time.AFTERNOON:
                setSalutation(salutationData.afternoonSalute);

                break;
            case Time.EVENING:
                setSalutation(salutationData.eveningSalute);

                break;
            default:
                break;
        }
    }, [setSalutation, time]);

    return (
        <Typography variant="body1" color="text.primary" align="center">
            {salutationData.body} {salutaion} 👋
        </Typography>
    );
}

function MyNameIs({ myNameIs }) {

    return (
        <Typography variant="body1" color="text.primary" align="center">
            {myNameIs.body}
        </Typography>
    );
}

function Name({ name }) {

    return (
        <Typography variant="h2" color="text.primary" align="center">
            <b>{name.body}</b>
        </Typography>
    );
}

function Occupation({ occupation }) {

    return (
        <Typography variant="h3" color="text.primary" align="center">
            <TypeAnimation
                sequence={occupation.body}
                cursor={true}
                repeat={Infinity}
                speed={1}
                deletionSpeed={1}
            />
        </Typography>
    );
}

