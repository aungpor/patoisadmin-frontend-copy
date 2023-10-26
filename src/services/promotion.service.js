import axios from "axios";

const patois_admin_url = process.env.REACT_APP_PATOIS_ADMIN_API_URI;
const patois_url = process.env.REACT_APP_PATOIS_API_URI;

export const getPromotionTypesService = async () => {
    return await axios.get(patois_url + '/api/promotion/types').then(res => {
        // console.log("getPromotionTypesService res", res);
        return res.data.data;
    }).catch((err) => {
        catchError(err, null, "getPromotionTypesService");
        return [];
    });
}

function catchError(error, path, func) {
    try {

        return;
    } catch (err) {
        console.error("Response catchError : ", error);
        console.log(err);
        return;
    }

}