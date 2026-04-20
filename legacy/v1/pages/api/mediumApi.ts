import mediumApiConfig from "../../utils/data/api/mediumApi.json";

export default async function mediumApi(req, res) {

    if (req.method !== "POST") {
        res.status(404).json(mediumApiConfig.postError);
    }

    try {
        const fetchData = await fetch(mediumApiConfig.url);
        const data = await fetchData.json();

        res.status(200).json(data.items);
    } catch (err) {

        res.status(404).json(mediumApiConfig.postError);
    }

}
