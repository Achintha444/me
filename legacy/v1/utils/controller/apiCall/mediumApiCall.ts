import { RequestMethod } from "../../functions/common";

export default async function mediumApiCall() {

    try {
        const res = await fetch("/api/mediumApi", { method:  RequestMethod.POST });

        const data = await res.json();

        return data;
    } catch (err) {
        return null;
    }
}
