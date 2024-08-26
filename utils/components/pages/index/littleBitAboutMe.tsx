import CommonDivider from "../../common/commonDivider";
import DescriptionList from "../../common/descriptionList";
import SubSectionTitle from "../../common/subSectionTitle";

export default function LittleBitAboutMe({ data }) {
    return (
        <>
            <br />
            <SubSectionTitle key="little-title" data={ data } />
            <br />
            {
                data.content.map((contentDesc) => (
                    <>
                        <DescriptionList key={ contentDesc.alt } list={ contentDesc.content } />
                        <br />
                    </>
                ))
            }
            <CommonDivider />
        </>
    );
}
